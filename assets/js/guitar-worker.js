self.addEventListener('message', (d) => {

	const sourceData = d.data;
	let number = sourceData;
	let temp_arr = [];
	let perData = [];
	let datalen = sourceData.length;

	pullpush(0);

	function pullpush(basic_value) {
		if(basic_value === datalen) {
			perData.push([...temp_arr]);
			return ;
		}
		for(let i = basic_value; i < datalen; i++){
			if(basic_value === 0) {
			}
			temp_arr.push(number.shift());
			pullpush(basic_value+1);
			number.push(temp_arr.pop());
		}
		if(basic_value === 0) {
			self.postMessage(perData);
		}
	}
});