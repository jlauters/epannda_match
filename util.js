Array.prototype.clean = function(deleteKey, deleteValue) {
    for( var i = 0; i < this.length; i++) {

        if(this[i][deleteKey] === deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }

    return this;
};

Array.prototype.sortByKey = function(key) {
    return this.sort(function(a, b) {
        var x = a[key];
        var y = b[key];

        return (( x > y ) ? -1 : ((x < y ) ? 1 : 0 )); 
    });
};
