$(".nav ul li").click(function() {
    $(this)
      .addClass("active")
      .siblings()
      .removeClass("active");
  });
  
  const tabBtn = document.querySelectorAll(".nav ul li");
  const tab = document.querySelectorAll(".tab");
  
  function tabs(panelIndex) {
    tab.forEach(function(node) {
      node.style.display = "none";
    });
    tab[panelIndex].style.display = "block";
  }
  tabs(0);
  
  let bio = document.querySelector(".bio");
  const bioMore = document.querySelector("#see-more-bio");
  const bioLength = bio.innerText.length;
  
  function bioText() {
    bio.oldText = bio.innerText;
  
    bio.innerText = bio.innerText.substring(0, 100) + "...";
    bio.innerHTML += `<span onclick='addLength()' id='see-more-bio'>See More</span>`;
  }
  //        console.log(bio.innerText)
  
  bioText();
  
  function addLength() {
    bio.innerText = bio.oldText;
    bio.innerHTML +=
      "&nbsp;" + `<span onclick='bioText()' id='see-less-bio'>See Less</span>`;
    document.getElementById("see-less-bio").addEventListener("click", () => {
      document.getElementById("see-less-bio").style.display = "none";
    });
  }
  

// to fetch cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
  

// Handle crop details form
const form = document.getElementById('form-crop');

form.addEventListener('submit', event => {
    event.preventDefault(); // Prevent the form from submitting normally

    const cropname = form.elements.crop.value;
    const quantity = form.elements.quantity.value;
    const price = form.elements.price.value;
    const farmer = getCookie('_id');
    console.log("A",farmer);

    axios.post('/addcrop', {cropname, quantity, price, farmer})
    .then(res=>{
        alert('Crop details updated check on list.');
        form.reset();
    })
    .catch(res=>{
        console.log(res);
        alert(res.message);
    })
});


// Fetch distributers list
$(document).ready(function() {
    function GetDistributerFromDB(id, path){
        $(`#${id} tbody`).html('');
        $.ajax({ url:`/${path}`,  method:"GET",  dataType:"json",
            success: function(data) {
                console.log(data);
                $.each(data, function(index, val) {
                    $(`#${id} tbody`).append(`<tr>
                        <td>${ val.username ? val.username  :''}</td>
                        <td>${ val.name     ? val.name      :''}</td>
                        <td>${ val.phone    ? val.phone     :''}</td>
                        <td>${ val.address  ? val.address   :''}</td>
                    </tr>`);
                });
            },
            error: function(jqXHR, textStatus, errorThrown) { console.log(textStatus, errorThrown); }
        });
    }
    GetDistributerFromDB('distributor', `alldistributor`);
})


// Fetch all crop list
$(document).ready(function() {
    function GetCropFromDB(id, path){
        $(`#${id} tbody`).html('');
        $.ajax({ url:`/${path}`,  method:"GET",  dataType:"json",
            success: function(data) {
                console.log(data.farmer);
                $.each(data, function(index, val) {
                    $(`#${id} tbody`).append(`<tr>
                        <td>${ val.cropname    ? val.cropname        :''}</td>
                        <td>${ val.quantity    ? val.quantity        :''}</td>
                        <td>${ val.price       ? val.price           :''}</td>
                        <td>${ val.farmer      ? val.farmer.name     :''}</td>
                        <td>${ val.distributor ? val.distributor.name:''}</td>
                        <td>${ val.retailer    ? val.retailer.name   :''}</td>
                    </tr>`);
                });
            },
            error: function(jqXHR, textStatus, errorThrown) { console.log(textStatus, errorThrown); }
        });
    }
    GetCropFromDB('mycrop', `mycrop/${getCookie('_id')}`);
    GetCropFromDB('allcrop', `allcrop`);
    $('#getmycrops').click(()=>GetCropFromDB('mycrop', `mycrop/${getCookie('_id')}`));
    $('#getallcrops').click(()=>GetCropFromDB('allcrop', `allcrop`));
})


// buy handler
function handleBuyClick(event) {
    const userId = getCookie('_id');
    const cropId = event.target.id;
    const distributor = $(`#s${cropId}`)[0].value;
    console.log(distributor);
    $.ajax({
        url: '/updatecrop', method: 'PUT',
        data: { userId, cropId, distributor },
        success: function(data) {
          alert('Purchased successfully');
          $(`#row${cropId}`).remove();
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('Error making PUT request:', errorThrown);
        }
      });
      
    console.log(`Button clicked with ID: ${cropId}`);
}


// Fetch buy crop list 
$(document).ready(function() {
    function GetCropFromDB(id, path){
        $(`#${id} tbody`).html('');
        let options='';
        $.ajax({ url:`/alldistributor`,  method:"GET",  dataType:"json",  success: function(data) {
                
            $.each(data, function(index, val) {
                options += `<option value='${val.username}'>${val.username}</option>`;
            })

            $.ajax({ url:`/${path}`,  method:"GET",  dataType:"json",  success: function(data) {
                    $.each(data, function(index, val) {
                        $(`#${id} tbody`).append(`<tr id='row${val._id}'>
                        <td>${ val.farmer ? val.farmer.name :''}</td>
                        <td>${ val.farmer ? val.farmer.phone:''}</td>
                        <td>${ val.cropname && val.quantity ? `${val.cropname}: ${val.quantity} Quintal`:''}</td>
                        <td><select id='s${val._id}'>${options}</select></td>
                        <td><button id='${val._id}' onclick='handleBuyClick(event)'>${ val.price ? `₹${val.price}` :''}</button></td>
                        </tr>`);
                    });
            },error: function(jqXHR, textStatus, errorThrown) { console.log(textStatus, errorThrown); }});
        
        },error: function(jqXHR, textStatus, errorThrown) { console.log(textStatus, errorThrown); }})
    }
    GetCropFromDB('buycrop', `buycrop`);
    // $('#getallcrops').click(()=>GetCropFromDB('buycrop', `buycrop`));
})