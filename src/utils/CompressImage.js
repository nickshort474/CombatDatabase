const  _compressImage = (image, size, callback) =>{
	    
    
	const width = size;

	
	const img = new Image();
	img.src = image;
	
	img.onload = () =>{
		
		const elem = document.createElement('canvas');

		const scaleFactor = width / img.width;
		elem.width = width;
		elem.height = img.height * scaleFactor;

		const ctx = elem.getContext('2d');

		ctx.drawImage(img,0,0,width, img.height * scaleFactor);

		let returnedFile = createBlob(ctx);
		
		returnedFile.then((blob)=>{
			
			callback(blob)
		})
		
		
		
		
	}

}


function createBlob(ctx){
	return new Promise((resolve,reject)=>{
		
		ctx.canvas.toBlob((blob)=>{
			let file = new File([blob], "message_image", {type:'image/jpeg', lastModified:Date.now()});
			//callback(file);
			resolve(file);
		}, 'image/jpeg', 1)
	})
}
exports._compressImage = _compressImage; 