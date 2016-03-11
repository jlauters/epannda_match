# ePANNDA Match
Consumes data from ePANNDA Wrapper. Performs fuzzy matching logic in an attempt to join iDigBio specimens to citations from PBDB using BHL as a full text resource.

### UPDATED APPROACH AND INFO
BHL seems to have removed OcrText from their API search making it harder to do machine based matching on full text.
I've updated my approach with a Python script to do stricter pruning of PBDB results and rely less on PBDB => BHL connections before
attempting to match against iDigbio Fields

I query PBDB Biblio References by the base name 'coleoptera'. I then filter these results checking if state/province (ex: 'Colorado') and locality (ex: 'Florissant')
exist in the Article Title. This helps to keep a smaller focused list of articles to match specimens for. Full text is still needed for increasing confidence of matches.
I've been finding the full text OCR plates via BHL's Web UI and creating arrays of Scientific Names, or Families manually to then check against the list of iDigBio Specimens.
In addition to this, i've been having success matching Scientific Name Authorship field to the Author of the paper or owner of the specimen collection.

##### Some Example Output

```
[ref:5139] Article Title: Adephagous and clavicorn Coleoptera from the Tertiary deposits at Florissant, Colorado with descriptions of a few other forms and a systematic list of the non-rhynchophorus Tertiary Coleoptera of North America matches search terms
[ref:5139] Author: Scudder
[ref:5139] Year: 1900
```

 - [ Full Text ] http://www.biodiversitylibrary.org/item/95317#page/11/mode/1up
 - https://paleobiodb.org/data1.1/refs/single.json?id=5139&show=both
 - http://search.idigbio.org/v2/view/3918ef54-90a3-4add-a826-9376b631d50a
 - http://search.idigbio.org/v2/view/1fb53fa7-17f4-41ee-b195-0913e2fa27b8
 - http://search.idigbio.org/v2/view/5625965a-007b-4d8d-aa71-7b7579fcd425
 - http://search.idigbio.org/v2/view/6423f0c0-f7f3-46c1-a2a6-017095d46238
 - http://search.idigbio.org/v2/view/04f6418b-3bc7-4534-b281-700a77019521
 - http://search.idigbio.org/v2/view/0e9810b8-fdb5-4ff6-829a-b1c4b81ea0e7
 - http://search.idigbio.org/v2/view/7b3b6846-3159-4a2b-bb32-61e8d3e60708
 - http://search.idigbio.org/v2/view/771e44d1-6d6f-4ed5-b7f1-4e9dd0d6f856
 - http://search.idigbio.org/v2/view/f8031b45-3195-4529-94a9-11df25b48e71
 - http://search.idigbio.org/v2/view/011544ec-5d66-46c7-98f9-abd2640b33f9
 - http://search.idigbio.org/v2/view/616d92eb-5e79-4a47-be07-d2f2b126162c
 - http://search.idigbio.org/v2/view/9997db77-5a69-482a-85bc-4cb9e10e2ae9
 - http://search.idigbio.org/v2/view/acd15894-48ab-41db-ac1d-12a5fbc96d1d
 - http://search.idigbio.org/v2/view/55395973-d565-45b4-86a8-90b7b58ce5eb
 - http://search.idigbio.org/v2/view/20594175-3997-49a7-bfd8-32293c6d2be6
 - http://search.idigbio.org/v2/view/192c3dd2-b1f4-45c7-9288-cd8c2c0aee35
 - http://search.idigbio.org/v2/view/1e47b938-84a0-4f84-baf0-034454b33712
 - http://search.idigbio.org/v2/view/a4317306-ee9c-43d6-9d89-500651f46efc
 - http://search.idigbio.org/v2/view/6061c3e7-6e2b-403d-b72d-ca9424caec0b
 - http://search.idigbio.org/v2/view/754bb17f-6826-427f-8c36-e6e58e9b0108
 - http://search.idigbio.org/v2/view/916f8a32-aa67-4c64-b1b7-d6250c72a411
 - http://search.idigbio.org/v2/view/51d896ca-a767-4d8c-b12b-7234ee5e59fb
 - http://search.idigbio.org/v2/view/2b74e327-c2c2-427c-b2e1-6b9ccd7a5c05
 - http://search.idigbio.org/v2/view/82b48039-069d-4ca6-b512-82da799e0e0c
 - http://search.idigbio.org/v2/view/f8f6598d-73c9-4f78-8932-e9de531068f7
 - http://search.idigbio.org/v2/view/c8ef43dc-04c6-45a1-b4f5-7c602e1dcbc2
 - http://search.idigbio.org/v2/view/25d3a561-9b2c-4acd-831c-ce0e5e96889f
 - http://search.idigbio.org/v2/view/b134196f-3681-45ef-ac2a-9eaa1fffd736
 - http://search.idigbio.org/v2/view/2e66597a-4a82-4c59-a9a1-7a34ba81df33
 - http://search.idigbio.org/v2/view/2a4b8637-08d0-4173-bfc8-3883da1fa31f

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
