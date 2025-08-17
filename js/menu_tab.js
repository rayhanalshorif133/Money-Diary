document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('show');
});


const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabContents.forEach(tc => tc.classList.remove('active'));
        tabButtons.forEach(b => b.classList.remove('active'));
        document.getElementById(target).classList.add('active');
        btn.classList.add('active');
    });
});