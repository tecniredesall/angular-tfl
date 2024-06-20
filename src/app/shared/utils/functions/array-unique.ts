export function arrayUnique(array: Array<any>, identifier: string): Array<any> {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i][identifier] === a[j][identifier])
                a.splice(j--, 1);
        }
    }

    return a;
}