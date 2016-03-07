# ePANNDA Match
Consumes data from ePANNDA Wrapper. Performs fuzzy matching logic in an attempt to join iDigBio specimens to citations from PBDB using BHL as a full text resource.

### Manually Found Matches

- http://search.idigbio.org/v2/view/records/c32288e2-cfba-447e-8491-5b82288a51f2
- https://paleobiodb.org/data1.1/refs/single.json?id=5172&show=both

- http://biodiversitylibrary.org/page/15413920#page/403/mode/1up

- https://paleobiodb.org/data1.1/refs/single.json?id=5170&show=both
- http://search.idigbio.org/v2/view/records/0e9810b8-fdb5-4ff6-829a-b1c4b81ea0e7

- https://paleobiodb.org/data1.1/refs/single.json?id=41345&show=both
- http://search.idigbio.org/v2/view/records/011544ec-5d66-46c7-98f9-abd2640b33f9

### iDigBio Matchable Fields
- Scientific Name Authorship
- Identification Remarks
- Recorded By
- Bibliographic Citation
- Event Date
- Occurence Remark
- Associated References
- Identification References
- Scientific Name
- Order
- State / Province
- Locality


### Outline of Matching Approach

Matching attempts so far have consisted of the following:

- using the async npm package, kick off the following searches for iDigBio and PBDB in parallel ( https://github.com/caolan/async#parallel ):
 - https://paleobiodb.org/data1.2/taxa/refs.json?base_name=coleoptera&textresult
 - http://search.idigbio.org/v2/search/records/?rq={%22scientificname%22:%22coleoptera%22,%22stateprovince%22:%22colorado%22}

```javascript
async.parallel({
    pbdb.bhl: function(callback) {
        request.get('https://paleobiodb.org/data1.2/taxa/refs.json?base_name=coleoptera&textresult', function(err, response, body) {
            if(!err && response.statusCode == 200) {
                // async callback
                callback(null, JSON.parse( body ))    
            }
        });
    },
    idigbio: function(callback) {
        var options = {
            url: "http://search.idigbio.org/v2/search/records/",
            json: true,
            headers: { 'Content-Type': 'application/json' },
            body: {
                "rq": { "order": "coleoptera", "stateprovince": "colorado"}
            }
        };

        request.get(options, function(err, response, body) {
          if(!err && response.statusCode == 200) {
              // async callback
              callback(null, JSON.parse( body ));
          }
        });
    }, function( err, results) {
        if(!err) {
            // do something with results from both calls
        }  
    }
  
})
```

-  then attempt to map PBDB Publication Title results to BHL using the following three BHL API Calls performed in an async waterfall
 ( https://github.com/caolan/async#waterfall )

```javascript
async.waterfall([

    // get PBDB Biblio References
    function(waterfall) {
        // using epannda_wrapper with dummy URL
        request.get('http://epandda.test/pbdb_lookup/coleoptera', function(err, response, body) {
            if(!err && response.statusCode == 200) {
                waterfall(null, JSON.parse( body ));
            }
        });  
    },

    // for each reference, look up publication title in BHL
    function(pbdb, waterfall) {
        async.forEach(pbdb, function(pb, callback) {
            // escape chars in title
            var title = encodeURIComponent( pb.publication );
            var options = { url: 'http://epandda.test/bhl_title/' + title };

            request.get(options, function(err, response, body) {
                if(!err && response.statusCode == 200) {
                    var results == JSON.parse( body );

                    if(results.titleID) {
                        // add titleID to custom pb object
                         pb.titleID = results.titleID;  
                    }

                    // foreach callback
                    callback();
                }
            });
        }, function(err) {
            if(!err) { waterfall(null, pbdb) }
            else { /* handle error */ }  
        });
    }, 

    // Look up itemID by titleID
    function(pbdb, waterfall) {

          async.forEach(pbdb, function(pb, callback) {
              if(pb.titleID) {
                  request('http://epandda.test/bhl_title_items/' + pb.titleID, function(err, response, body) {
                      if(!err && response.statusCode == 200) {
                          var results = JSON.parse( body )

                          // do logic to determine if we have the right match
                          if( hasMatch ) {
                              pb.itemID.push( itemID );  
                          }

                          // forEach Callback
                          callback();
                      }
                  });
              }
          }, function(err) {
              if(!err) { waterfall(null, pbdb) }  
          });
    },

    // Parse through itemPages for OCR
    function(pbdb, waterfall) {
        async.forEach(pbdb, function(pb, meta_callback) {
            var items = pb.itemID;
            for( var i = 0; i < items.length; i++ ) {
                (function(i) {

                    request.get('http://epandda.test/bhl_item_meta/' + items[i], function(err, response, body) {
                        var results = JSON.parse( body );
                        var pages   = results.item_meta.pages

                        if( pages.length ) {
                            for(var j = 0; j < pages.length; j++) {
                                (function(j) {

                                  // Look for pages with some meat
                                  if( 1000 <= pages[j].OcrText.length) {
                                    // compare OcrText against various fields
                                    if( hasMatch) {
                                      // success!
                                    }
                                  }
                                } )(j) 
                            }
                        }
                    });
                  
                })(i)
            }
            meta_callback(pbdb);
        }, function(err) {
          if(!err) { waterfall(null, pbdb); }
        })
    }
], function(err, results) {
    // Waterfall done.
    if(!err) { /* Do something with the results */ }
})
```

- the last BHL call for GetItemMetadata returns an array of Page objects. These Page objects contain an "OcrText" field I parse for string matching on the above listed
'iDigBio Matchable Fields' as  well as the PBDB Article Title

- based on the number of string matches, a confidence score is assigned. currently all matches have the same weight, this could be adjusted to more accurately assess
match strength and can then be indexed off of through the ePANDDA API parameters to adjust the result set.


### Future Improvements
This was an okay first attempt. Performing real time matching logic is not practical:
- cron job like task to mine PBDB -> BHL results that have OCR Text available 
  - keep list of PBDB oid "ref:####" that don't have BHL matches to reduce number of API Calls for bad results
- MongoDB Lookup table(s) for Order, Collector, Author mapped to iDigBio UUIDs and PBDB oids ??
- tune confidence scoring algorithm for better quality scoring

### Example Output
```javascript
[
  {
    pbdb_link: "https://paleobiodb.org/data1.1/refs/single.json?id=53771&show=both",
    idigbio_link: "http://search.idigbio.org/v2/view/records/5993b351-8e1a-42be-9b68-5e1b5a3ef4ae",
    ocr_link: "",
    score: 3,
    matched_on: "order - title,locality - title,state/province - title"
  },
  {
    pbdb_link: "https://paleobiodb.org/data1.1/refs/single.json?id=53771&show=both",
    idigbio_link: "http://search.idigbio.org/v2/view/records/3918ef54-90a3-4add-a826-9376b631d50a",
    ocr_link: "",
    score: 3,
    matched_on: "order - title,locality - title,state/province - title"
  }
]
```

### Alternative Output Idea
```javascript
// Using JSON+LD stuff 'annotation' object onto iDigBio Specimen Record

{
  uuid: "0e9810b8-fdb5-4ff6-829a-b1c4b81ea0e7",
  type: "records",
  etag: "73a5e1c9e141860d8fe86478697c46b02883ff15",
  data: {
      // darwinCore Fields
  },
  indexTerms: {
      // terms
  },
  attribution: {
    uuid: "271a9ce9-c6d3-4b63-a722-cb0adc48863f",
    name: "Museum of Comparative Zoology, Harvard University",
    description: "The Museum of Comparative Zoology ....",
    logo: "http://digir.mcz.harvard.edu/ipt/logo.do?r=mczbase",
    url: "http://mczbase.mcz.harvard.edu/",
    emllink: "http://digir.mcz.harvard.edu/ipt/eml.do?r=mczbase",
    archivelink: "http://digir.mcz.harvard.edu/ipt/archive.do?r=mczbase",
    contacts: [
      {
        first_name: "MCZ",
        last_name: "Harvard University"
      },
      {
        first_name: "Brendan",
        last_name: "Haley",
        role: "Senior Database Manager",
        email: "bhaley@oeb.harvard.edu"
      }
    ],
    data_rights: "CC4 BY-NC",
    publisher: "d347ee15-f16e-4650-930c-4e54d9ce549e"
  },
  annotation: {
      @pbdb_url: "https://paleobiodb.org/data1.1/refs/single.json?id=5170&show=both",
      @ocr_url: "http://biodiversitylibrary.org/page/15413920#page/403/mode/1up" 
  } 
}

```
