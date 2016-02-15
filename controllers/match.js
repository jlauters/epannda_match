var async = require('async');

module.exports = {

    combine: function(pbdb_bhl, idigbio, callback) {

        var matches = [];
        var pbdb = pbdb_bhl.clean("ocr", "");

        async.forEach(idigbio, function(idig, done) {

            // init
            var uuid        = idig.uuid;
            var sciNameAuth = idig.data['dwc:scientificNameAuthorship'];

            var sciNameAuthDate = '';
            if(undefined != sciNameAuth && ( 0 < sciNameAuth.indexOf( ' ' )) ) {
                var sciNameParts = sciNameAuth.split(' ');
                sciNameAuth     = sciNameParts[0];
                sciNameAuthDate = sciNameParts[1];
            }

            var identRemarks     = idig.data['dwc:identificationRemarks'];
            var recordedBy       = idig.data['dwc:recordedBy'];
            var biblioCitation   = idig.data['dcterms:bibliographicCitation'];
            var eventDate        = idig.data['dwc:eventDate'];
            var occurrenceRemark = idig.data['dwc:occurrenceRemarks'];
            var associatedRef    = idig.data['dwc:associatedReferences'];
            var identRef         = idig.data['dwc:identificationReferences'];
            var scientificName   = idig.data['dwc:scientificName'];
            var order            = idig.data['dwc:order'];
            var stateProvince    = idig.data['dwc:stateProvince'];
            var locality         = idig.data['dwc:locality'];

            // Trying Synchronous approach. Maybe change out for async.foreach
            for( var pidx = 0; pidx < pbdb.length; pidx++) {

                var score = 0;
                var matched_on = [];

                if(sciNameAuth && 0 < pbdb[pidx].auth1.indexOf( sciNameAuth )) {
                    score++;
                    matched_on.push('SciNameAuth - auth1');
                }
                if(sciNameAuth && 0 < pbdb[pidx].auth2.indexOf( sciNameAuth )) {
                    score++;
                    matched_on.push('SciNameAuth - auth2');
                }
                if(sciNameAuth && 0 < pbdb[pidx].oauth.indexOf( sciNameAuth )) {
                    score++;
                    matched_on.push('SciNameAuth - oauth');
                }
                if( 0 < pbdb[pidx].auth1.indexOf( recordedBy )) {
                    score++;
                    matched_on.push('recordedBy - auth1');
                }
                if( 0 < pbdb[pidx].auth2.indexOf( recordedBy )) {
                    score++;
                    matched_on.push('recordedBy - auth2');
                } 
                if( 0 < pbdb[pidx].oauth.indexOf( recordedBy )) {
                    score++;
                    matched_on.push('recordedBy - oauth');
                }
                if( 0 < pbdb[pidx].auth1.indexOf( identRemarks )) {
                    score++;
                    matched_on.push('identRemarks - auth1');
                }
                if( 0 < pbdb[pidx].auth2.indexOf( identRemarks )) {
                    score++;
                    matched_on.push('identRemarks - auth2');
                }
                if( 0 < pbdb[pidx].oauth.indexOf( identRemarks )) {
                    score++;
                    matched_on.push('identRemarks - oauth');
                }
                if( 0 < pbdb[pidx].title.indexOf( scientificName )) {
                    score++;
                    matched_on.push('scientificName - title');
                }
                if( 0 < pbdb[pidx].publication.indexOf( scientificName )) {
                    score++;
                    matched_on.push('scientificName - publication');
                }
                if( 0 < pbdb[pidx].title.indexOf( order )) {
                    score++;
                    matched_on.push('order - title');
                }
                if( 0 < pbdb[pidx].publication.indexOf( order )) {
                    score++;
                    matched_on.push('order - publication');
                }
                if( 0 < pbdb[pidx].title.indexOf( locality )) {
                    score++;
                    matched_on.push('locality - title');
                }
                if( 0 < pbdb[pidx].publication.indexOf( locality )) {
                    score++;
                    matched_on.push('locality - publication');
                }
                if( 0 < pbdb[pidx].title.indexOf( stateProvince )) {
                    score++;
                    matched_on.push('state/province - title');
                }
                if( 0 < pbdb[pidx].publication.indexOf( stateProvince )) {
                    score++;
                    matched_on.push('state/province - publication');
                }
                if( 0 < pbdb[pidx].ocr.indexOf( stateProvince )) {
                    score++;
                    matched_on.push('state/province - ocr');
                }
                if( 0 < pbdb[pidx].ocr.indexOf( locality )) {
                    score++;
                    matched_on.push('locality - ocr');
                }
                if( 0 < pbdb[pidx].ocr.indexOf( order )) {
                    score++;
                    matched_on.push('order - ocr');
                }
                if( 0 < pbdb[pidx].ocr.indexOf( scientificName )) {
                    score++;
                    matched_on.push('scientificName - ocr');
                }
                if( 0 < pbdb[pidx].ocr.indexOf( identRemarks )) {
                    score++;
                    matched_on.push('identRemarks - ocr');
                }
                if( 0 < pbdb[pidx].ocr.indexOf( recordedBy )) {
                    score++;
                    matched_on.push('recordedBy - ocr');
                }
                if(sciNameAuth && 0 < pbdb[pidx].ocr.indexOf( sciNameAuth )) {
                    score++;
                    matched_on.push('scinameAuth - ocr');
                }

                if(2 < score) {
                    var match = {
                        //"pbdb": pbdb[pidx],
                        "pbdb_link": "https://paleobiodb.org/data1.1/refs/single.json?id=" + pbdb[pidx].oid + "&show=both", // 1.2 version 500's
                        "idigbio_link": "http://search.idigbio.org/v2/view/records/" + uuid,
                        "ocr_link": pbdb[pidx].page_link,
                        //"idigbio
                        "score": score,
                        "matched_on": matched_on.toString()
                    };

                    matches.push( match );
                }
            } 

            done();
        },
        function(err) {
            console.log('matching complete');
            console.log('found ' + matches.length + ' matches');

            callback(null, matches.sortByKey('score'));
        });

    }
}
