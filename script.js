const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
let events = JSON.parse(localStorage.getItem('events')) || {};
const adminHash = "2cd3d9544a602ba4f1fb2764c254f6db";

let currentDate = new Date();
const datesElement = document.getElementById('dates');
const monthYearElement = document.getElementById('month-year');
const eventModal = document.getElementById('eventModal');
const eventDateInput = document.getElementById('eventDate');
const eventNameInput = document.getElementById('eventName');
const eventDescriptionInput = document.getElementById('eventDescription');
const modalTitle = document.getElementById('modalTitle');
const contextMenu = document.getElementById('contextMenu');
const dayInfo = document.getElementById('dayInfo');
const eventDetails = document.getElementById('eventDetails');
let selectedDate = null;
let selectedEventIndex = null;

function loadCalendar(date) {
    datesElement.innerHTML = '';
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    monthYearElement.textContent = `${monthNames[month]} ${year}`;

    for (let i = 0; i < firstDay; i++) {
        const emptyElement = document.createElement('div');
        emptyElement.className = 'date empty';
        datesElement.appendChild(emptyElement);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateElement = document.createElement('div');
        const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dateElement.className = 'date';
        dateElement.textContent = day;
        dateElement.onclick = (e) => openContextMenu(e, fullDate);

        if (fullDate === formatDate(currentDate)) {
            dateElement.classList.add('today');
        }

        if (events[fullDate]) {
            events[fullDate].forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event';
                eventElement.textContent = event.name;
                dateElement.appendChild(eventElement);
            });
        }

        datesElement.appendChild(dateElement);
    }
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    loadCalendar(currentDate);
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    loadCalendar(currentDate);
}

function promptPassword() {
    const inputPassword = prompt("Introduce la contraseña de administrador:");
    const inputHash = CryptoJS.MD5(inputPassword).toString();

    if (inputHash === adminHash) {
        alert("Contraseña correcta. Puedes administrar los eventos.");
        document.body.classList.add('admin');
    } else {
        alert("Contraseña incorrecta.");
    }
}

function openContextMenu(e, date) {
    selectedDate = date;
    if (!document.body.classList.contains('admin')) {
        eventDetails.innerHTML = `<strong>Eventos para ${selectedDate}:</strong>`;
        const eventsList = events[selectedDate] || [];
        eventsList.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.textContent = `${event.name}: ${event.description}`;
            eventDetails.appendChild(eventDiv);
        });
        eventDetails.style.display = 'block';
    } else {
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;

        dayInfo.innerHTML = `<strong>Eventos para ${selectedDate}:</strong>`;
        const eventsList = events[selectedDate] || [];
        eventsList.forEach((event, index) => {
            const eventDiv = document.createElement('div');
            eventDiv.textContent = `${event.name}: ${event.description}`;
            eventDiv.dataset.index = index;
            eventDiv.onclick = (ev) => {
                selectedEventIndex = index;
                ev.stopPropagation();
            };
            dayInfo.appendChild(eventDiv);
        });
    }

    e.stopPropagation();
}

function closeContextMenu() {
    contextMenu.style.display = 'none';
    eventDetails.style.display = 'none';
}

function addEvent() {
    closeContextMenu();
    eventDateInput.value = selectedDate;
    eventNameInput.value = '';
    eventDescriptionInput.value = '';
    modalTitle.textContent = `Agregar Evento para ${selectedDate}`;
    eventModal.style.display = 'block';
    selectedEventIndex = null;
}

function editEvent() {
    closeContextMenu();
    const eventsList = events[selectedDate] || [];
    const event = eventsList[selectedEventIndex];
    if (event) {
        eventDateInput.value = selectedDate;
        eventNameInput.value = event.name;
        eventDescriptionInput.value = event.description;
        modalTitle
        .textContent = `Editar Evento para ${selectedDate}`;
        eventModal.style.display = 'block';
    }
}

function removeEvent() {
    closeContextMenu();
    const eventsList = events[selectedDate] || [];
    if (eventsList.length > 0 && selectedEventIndex !== null) {
        const confirmDelete = confirm(`¿Seguro que quieres eliminar el evento seleccionado para ${selectedDate}?`);
        if (confirmDelete) {
            eventsList.splice(selectedEventIndex, 1);
            if (eventsList.length === 0) {
                delete events[selectedDate];
            } else {
                events[selectedDate] = eventsList;
            }
            localStorage.setItem('events', JSON.stringify(events));
            loadCalendar(currentDate);
        }
    }
}

function closeModal() {
    eventModal.style.display = 'none';
}

function saveEvent() {
    const date = eventDateInput.value;
    const eventName = eventNameInput.value.trim();
    const eventDescription = eventDescriptionInput.value.trim();
    if (!eventName || !eventDescription) return;

    if (!events[date]) {
        events[date] = [];
    }

    if (selectedEventIndex === null) {
        events[date].push({ name: eventName, description: eventDescription });
    } else {
        events[date][selectedEventIndex] = { name: eventName, description: eventDescription };
    }

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
    loadCalendar(currentDate);
}

var estado = 0;

function cambiarColores() {
    var favicon = document.getElementById("favicon");
    if (estado === 0) {
        favicon.href = "img/logoIconR.png";
        document.documentElement.style.setProperty('--colorDef', '#ce0000');
        document.documentElement.style.setProperty('--colorHov', '#ff6f6f');
        estado = 1;
    } else {
        favicon.href = "img/logoIconB.png";
        document.documentElement.style.setProperty('--colorDef', '#007bff');
        document.documentElement.style.setProperty('--colorHov', '#459fff');
        estado = 0;
    }
}

var estado2 = 0;

function darkmode() {
    if (estado2 === 0) {
        document.documentElement.style.setProperty('--colorBack', '#fff');
        document.documentElement.style.setProperty('--colorDay', '#f7f7f7');
        estado2 = 1;
    } else {
        document.documentElement.style.setProperty('--colorBack', '#141414');
        document.documentElement.style.setProperty('--colorDay', '#1f1f1f');
        estado2 = 0;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCalendar(currentDate);
    document.addEventListener('click', closeContextMenu);
    contextMenu.addEventListener('click', e => e.stopPropagation());
    eventDetails.addEventListener('click', closeContextMenu);
});
