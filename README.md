# ePANNDA Match
Consumes data from ePANNDA Wrapper. Performs fuzzy matching logic in an attempt to join iDigBio specimens to citations from PBDB using BHL as a full text resource.

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
