// home page form handle
const form = document.getElementById('form-signup');
const form2 = document.getElementById('form-login');

form.addEventListener('submit', event => {
    event.preventDefault(); // Prevent the form from submitting normally

    const username = form.elements.username.value;
    const password = form.elements.password.value;
    const name = form.elements.name.value;
    const address = form.elements.address.value;
    const phone = form.elements.phone.value;
    const type = form.elements.type.value;
    
    axios.post('signup', {username, password, name, phone, address, type})
    .then(res=>{
        alert('Signup successful login now');
        document.querySelector('#login').click();
    })
    .catch(res=>{
        alert('Username already exist please login')
    })
});

form2.addEventListener('submit', event => {
    event.preventDefault();

    const username = form2.elements.username.value;
    const password = form2.elements.password.value;

    axios.post('login', {username, password})
    .then(res=>{
        window.location.href = '/main';
    })
    .catch(res=>{
        console.log(res);
        alert('Username or Password does not match.')
        window.location.reload;
    })
});