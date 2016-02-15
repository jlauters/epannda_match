var async   = require('async'),
    match   = require('./match.js'),
    request = require('request');

module.exports = function(app, config) {

    return {
        index: function(req, res, next) {

            async.parallel({

                pbdb_bhl: function(callback) {

                    console.log('Starting PBDB + BHL merger in Parallel ...');
                    async.waterfall([
                        function(waterfall) {
                            request.get('http://localhost:3000/pbdb_lookup/coleoptera', function(err, response, body) {
                                if(!err && response.statusCode == 200) {
                                    console.log('PBDB Taxon lookup complete ... ');
                                    waterfall(null, JSON.parse(body)); 
                                } else {
                                    waterfall(new Error('PBDB Lookup Failed'), '');
                                }
                            });
                        },
                        function(pbdb, waterfall) {

                            console.log('getting title for ' + pbdb.length);

                            async.forEach(pbdb, function(pb, callback) {

                                console.log('getting title for: ' + pb.publication);

                                request.get('http://localhost:3000/bhl_title/' + encodeURIComponent( pb.publication ), function(err, response, body) {
                                    if(!err && response.statusCode == 200) {
                                        var results = JSON.parse(body);

                                        if(results.titleID) {
                                            console.log('setting titleID: ' + results.titleID + ' for pb.oid: ' + pb.oid);
                                            pb.titleID = results.titleID;
                                        } else {
                                            console.log('title not found in BHL');
                                        }
                                        callback();
                                    } else {
                                        console.log('Title Lookup failed for: ' + pb.publication);
                                        waterfall(new Error('BHL Title Lookup Failed'), '');
                                    }
                                });

                            }, function(err) {
                                if(err) { console.log('title Search Error!'); return waterfall(err) }
                                else {
                                    console.log('Title Search done. we have: ' + pbdb.length + ' to send'); 
                                    waterfall(null, pbdb);
                                }
                            });
                        },
                        function(pbdb, waterfall) {

                            console.log('pruning PBDB init count: ' + pbdb.length);
                            pbdb = pbdb.clean('titleID', "");
                            console.log('Cleaned Results: ' + pbdb.length);

                            async.forEach(pbdb, function(pb, callback) {

                                request.get('http://localhost:3000/bhl_title_items/' + pb.titleID, function(err, response, body) {
                                    if(!err && response.statusCode == 200) {
                                        var results = JSON.parse( body );
                                        var itemID = 0;
                                        var year   = pb.year;
                                        var volume = pb.volume; 

                                        for(var i = 0; i < results.title_items.length; i++) {
                                            (function(idx) {
                                                if( 0 < results.title_items[idx].Year.indexOf( year ) ||
                                                    0 < results.title_items[idx].Volume.indexOf( volume ) ) {
                   
                                                    itemID = results.title_items[idx].ItemID;
                                                    pb.itemID.push( itemID );
                                                    console.log('setting itemID: ' + itemID + ' for pb.oid: ' + pb.oid);
                                                    return itemID;
                                                }
                                            })(i);
                                        }

                                        callback();
                                    } 
                                });
                            }, function(err) {
                                if(err) { return waterfall(err) }
                                else {
                                    console.log('title items done.');
                                    waterfall(null, pbdb);
                                }
                            });
                        },
                        function(pbdb, waterfall) {
                            
                            async.forEach(pbdb, function(pb, callback) {

                                async.forEach(pb.itemID, function(itemid, item_callback) {

                                    request.get('http://localhost:3000/bhl_item_meta/' + itemid, function(err, response, body) {
                                        if(!err && response.statusCode == 200) {
                                            var results = JSON.parse( body );
                                            var pages = results.item_meta.Pages.clean('OcrText', "");

                                            // this might need to be async.eachSeries
                                            async.forEach(pages, function(page, next) {
                                                if( 0 < page.OcrText.indexOf( pb.publicaton ) ) {
                                                    console.log('Found OCR Match! on title: ' + pb.publication);
                                                    pb.ocr = page.OcrText;
                                                    pb.page_link = page.OcrUrl;
                                                } 

                                                next();
                                            },
                                            function(err) {
                                                if(!err) {
                                                    console.log('OCR Check complete!');
                                                    item_callback(null, pbdb);
                                                }
                                            });
                                        }
                                    });
                                },
                                function(err) {
                                    if(!err) {
                                        console.log('inner success!');
                                        callback(null, pbdb);
                                    }
                                });
                            },
                            function(err) {
                                if(err) { return waterfall(err) }
                                else {
                                    console.log('Item Meta done.');
                                    waterfall(null, pbdb);
                                }
                            }); 
                         }
                    ], function(err, results) {
                        if(!err) { 
                            callback(null, results);
                        }
                        else { callback(true, 'Waterfall error: ' + err); }
                    })
                },
                idigbio: function(callback) {

                    console.log('Starting iDigBio Search in parallel...');
                    request.get('http://localhost:3000/idigbio_lookup/coleoptera/colorado', function(err, response, body) {
                        if(!err && response.statusCode == 200) {
                            callback(null, JSON.parse(body));
                        } else {
                            callback(true, err);
                        }
                    });
                }

            }, function(err, results) {

                if(!err) {

                    console.log('parallel tasks complete');

                    // Do Something with the Data
                    var idig_count    = results.idigbio.length;
                    var pbdbbhl_count = results.pbdb_bhl.length;

                    match.combine(results.pbdb_bhl, results.idigbio, function(err, results) {
                        console.log('match combine finished .. ');
                        res.setHeader("Content-Type", "application/json");
                        res.send( JSON.stringify(results, 0, 4) );
                    });

                    // TODO: IDigBio Results, PBDB+OCR Results will go to Matching Function and then Displayed as JSON

                    //res.write('ePANNDA Matching App Index. iDigBio Count: ' + idig_count + ' pbdb_bhl count: ' + pbdbbhl_count);
                    //res.end();
                } else {
                    console.log('Error with parallel async');

                    res.setHeader("Content-Type", "application/json");
                    res.send( JSON.stringify(results, 0, 4) );
                }
            });
        }
    }
}
