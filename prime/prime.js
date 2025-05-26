const frm = document.getElementById('frm');
const frmInput = document.getElementById('frm-input');
const frmSubmit = document.getElementById('frm-submit');
const result = document.getElementById('result');

function isPrime(n) {
  for (let i = n - 1; i >= Math.sqrt(n); i--) {
    if (n % i === 0) {
      return false;
    }
  }

  return true;
}

frm.addEventListener('submit', function (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const rs = isPrime(formData.get('n'));

  if (rs) {
    result.innerText = 'Số nguyên tố';
  } else {
    result.innerText = 'Hợp số';
  }
});
