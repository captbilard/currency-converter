if (!('serviceWorker' in navigator)) {
    console.log('Service worker not supported');
  }

if ('serviceWorker' in navigator) {
    window.addEventListener('load', reg => {
      navigator.serviceWorker.register('/7daysofcode/sw/sw.js').then(worked => {
          console.log('Service worker registration was succesful with scope: ', worked.scope);
      }).catch(error => {
          console.log("Registration failed : ", error);
      });
    });
  }



fetch('https://free.currencyconverterapi.com/api/v5/currencies').then(response => {
    return response.json();
}).then(data => {
    currencies = data.results;
    return currencies;
}).then(currency_list => {
    for(symbol in currencies){
        //create the option tag and append the values and text fetched from the API;
        let select1 = document.querySelector("select");
        let fromoption = document.createElement("option");
        fromoption.value = currencies[symbol].id;
        fromoption.text = currencies[symbol].currencyName;
        //create the to option tag by cloning from option
        toOption = fromoption.cloneNode(true);
        toOption.value = currencies[symbol].id;
        toOption.text = currencies[symbol].currencyName;

        //save each node to their parent element
        select1.appendChild(fromoption);
        document.getElementById('to_option').appendChild(toOption);
         //console.log(currencies[symbol].currencyName);
         //console.log(currencies[symbol].id);
        }
    });

/*This section of the code is to convert from one currency to the other*/
let convert = () => {
    let display = document.getElementById('toValue');
    let fromCurrency = document.getElementById('convertValue').value;
    let fromValue = document.getElementById('convertFrom').value;
    let toValue = document.getElementById('convertTo').value;
    let query = `${fromCurrency}_${toCurrency}`;

    fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=y`).then(response => {
        if(response.ok){
            return response.json();
        }else{
            const err = "There seems to be a problem with the network, kindly check your connection";
            alert(err);
        }
    }).then(data => {
        //console.log(data);
       for(item in data){
           let rates = data[item].val;
           let equivalent_amount = parseFloat(fromCurrency * rates);
           display.value=equivalent_amount;
       }
    });


}




