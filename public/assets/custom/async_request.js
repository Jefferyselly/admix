

function custom_async_request(res_id, req_type, data, url, custom_func = false){
  //start the loader
  document.querySelector('#loader').setAttribute('class','loader');
    //Initiate the fetch command
    
    let response = fetch(url,{
        method : req_type,
        body : JSON.stringify(data),
        headers: new Headers({"content-type" : "application/json"})
    }).then(res => res.json()).then((data) => {
        if(custom_func == false){
            //use core function to display message in-page
            core_placement(res_id,data);

            //end the loader
            document.querySelector('#loader').removeAttribute('class');
        }
    })
    .catch(error => {
        // handle the error
        console.log(error);
    });

}

function core_placement(res_id,data){
   const holder =  document.querySelector(res_id);
   //check if data is error or suceess to show the appriopriate button
   if(data.code == 0){
    holder.setAttribute('class','btn btn-danger mb-2')
   }else{
    if(data.redirect){
      window.location.href = data.redirect;
    }else{
    holder.setAttribute('class','btn btn-success mb-2')}
   }
   
   //send data inside the area
    holder.innerHTML = data.message
}