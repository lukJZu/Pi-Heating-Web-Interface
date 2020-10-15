export function getBoilerStates(callback, limit){

    //set limit to 0 if no limit is defined
    limit = limit ? limit : 0

    const xhr = new XMLHttpRequest()
    const method = 'GET'
    const url = `http://127.0.0.1:8000/api/boilerStates/${limit}`
    const responseType = "json"
  
    xhr.responseType = responseType
    xhr.open(method, url)
    // xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
    // xhr.setRequestHeader("Access-Control-Allow-Origin", "*")
    // xhr.setRequestHeader("X-CSRFToken", csrftoken)
    xhr.onload = function() {
        callback(xhr.response, xhr.status)
    }
    xhr.onerror = function (e) {
      console.log(e)
      callback({"message": "The request was an error"}, 400)
    }
    xhr.send()
  
}
  