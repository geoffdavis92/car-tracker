function get (query, callback) {
	let res = $.ajax({url:'/data/get',data:query}).success(function(data) { callback(data) })
}

function view(category,mountNode) {
	get({by:'category'}, function(data) {
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
		let o = {}, _arr = []

		if (p === 'price_gal' || p === 'fill_cost') {
			for (let _i=0;_i<d[p].length;_i++) {
				_arr.push(parseFloat(d[p][_i].replace(/\$/g,'')))
			}
		}

		o['label'] = l
		o['data'] = p !== 'price_gal' && p !== 'fill_cost' ? d[p] : _arr
		o['borderColor'] = `rgba(${c[0]},${c[1]},${c[2]},.9)`
		o['backgroundColor'] = `rgba(${c[0]},${c[1]},${c[2]},.3)`
		o['fill'] = true
		a.push(o)
		return a
	},
	setupAvg = function(d,l,p,c,a=sets) {
		let o = {}, avg = function(_d) {
			let _sum = 0
			for(i=0;i<_d.length;i++) {
				_sum += parseFloat(_d[i].replace(/\$/g,''))
			}
			// console.log(_sum, _d.length, (_sum / _d.length))
			return (_sum / _d.length)
		}, _arr = []
		avg = avg(d[p])
		for(z=0;z<54;z++) {
			avg = parseFloat(avg.toString().split('.')[0] + '.' + avg.toString().split('.')[1].substr(0,2))
			_arr.push(avg)
		}

		o['label'] = l
		o['data'] = _arr
		o['borderColor'] = `rgba(${c[0]},${c[1]},${c[2]},1)`
		o['backgroundColor'] = `transparent`
		o['fille'] = false
		a.push(o)
		return a
	}