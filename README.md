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
