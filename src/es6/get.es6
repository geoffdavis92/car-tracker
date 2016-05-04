function get (url,query, callback) {
	let res = $.ajax({url:`/data/get${url}`,data:query}).success(function(data) { callback(data) })
}

function view(category,mountNode) {
	get('/car/category',{}, function(data) {
		// console.log(data[category])
		return $(mountNode).html(`
			<table>
				<tr>
					<th>${category.toUpperCase()}</th>
				</tr>
				<tr>
					<td>${data[category].join().replace(/\,/g,'</td></tr><tr><td>').replace(/GMT\-0\d00|\(CDT\)|\(CST\)/g,'')}
			</table>`)
	})
}

const sets = [],
	setupData = function(d,l,p,c,a=sets) {
		let o = {},
			_arr = []
		// Replace Dollar signs, parse floats of price_gal/fill_cost
		if (p === 'price_gal' || p === 'fill_cost') {
			for (let _i=0;_i<d[p].length;_i++) {
				_arr.push(parseFloat(d[p][_i].replace(/\$/g,'')))
			}
		}
		// Construct Dataset object
		o['label'] = l
		o['data'] = p !== 'price_gal' && p !== 'fill_cost' ? d[p] : _arr
		o['borderColor'] = `rgba(${c[0]},${c[1]},${c[2]},.9)`
		o['backgroundColor'] = `rgba(${c[0]},${c[1]},${c[2]},.3)`
		o['fill'] = true
		o['lineTension'] = 1
		// Push dataset object to given array
		a.push(o)
		return a
	},
	setupAvg = function(d,l,p,c,a=sets) {
		let o = {},
			avg = function(_d) {
				let _sum = 0
				// Replace Dollar signs, parse into floats
				for(i=0;i<_d.length;i++) {
					_sum += parseFloat(_d[i].replace(/\$/g,''))
				}
				// Return the average
				return (_sum / _d.length)
			},
			_arr = []
		// get average of [property] in dataset (d)
		avg = avg(d[p])
		// Push avg to dummy array 54 times*, to allow proper line across graph
		for(z=0;z<54;z++) {
			avg = parseFloat(avg.toString().split('.')[0] + '.' + avg.toString().split('.')[1].substr(0,2))
			_arr.push(avg)
		}

		// Construct Dataset object
		o['label'] = l
		o['data'] = _arr
		o['borderColor'] = `rgba(${c[0]},${c[1]},${c[2]},1)`
		o['backgroundColor'] = `transparent`
		o['fille'] = false
		// Push dataset object to given array
		a.push(o)
		return a
	}