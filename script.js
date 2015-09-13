function makeEntry(journalDate) {
	var date = journalDate || getDate();
	$("#entries").prepend("<div class='entry' id='"+date+"'><h1 class='date'>"+date+"</h1><br/><div class='checkbox'><input type='checkbox' value='Asthma'/>Asthma</div><div class='checkbox'><input type='checkbox' value='Asthma Controller'/>Asthma Controller</div><div class='checkbox'><input type='checkbox' value='Asthma Rescue Inhaler'/>Asthma Rescue Inhaler</div><div class='checkbox'><input type='checkbox' value='Energy Drink'/>Energy Drink</div><div class='checkbox'><input type='checkbox' value='Eggs'/>Eggs</div><div class='checkbox'><input type='checkbox' value='Gluten'/>Gluten</div><div class='checkbox'><input type='checkbox' value='Soy'/>Soy</div><div class='checkbox'><input type='checkbox' value='Dairy'/>Dairy</div><div class='checkbox'><input type='checkbox' value='Grains'/>Grains</div><div class='checkbox'><input type='checkbox' value='Whey Protein'/>Whey Protein</div><div class='checkbox'><input type='checkbox' value='Smoothie'/>Smoothie</div><br/><h2 class='food-label'>Food:</h2><h2 class='symptom-label'>Symptoms:</h2><br/><div id='all_entry_wrapper'><div id='food_entry_wrapper'><ul id='food_entries'></ul></div><div id='symptom_entry_wrapper'><ul id='symptom_entries'></ul></div></div></div><hr/>");
	// journal entry
	journal.entries = journal.entries || {}; // ensure entries is an object
}

function showEntries() {
	for (var p in journal.entries) {
		makeEntry(p);
		if (journal.entries[p].food) {
			var foodEntries = journal.entries[p].food;
			for (var i = 0; i < foodEntries.length; i++) {
				$("#food_entries").prepend("<li class='food_entry' id='"+p.replace(/\//g, '')+i+"food"+"' onclick='editEntry(this.id);'>"+foodEntries[i]+"</li>");
			}
		}
		if (journal.entries[p].symptoms) {
			var symptomEntries = journal.entries[p].symptoms;
			for (var i = 0; i < symptomEntries.length; i++) {
				$("#symptom_entries").prepend("<li class='symptom_entry' id='"+p.replace(/\//g, '')+i+"symptom"+"' onclick='editEntry(this.id);'>"+symptomEntries[i]+"</li>");
			}
		}
		//checkbox setup
		journal.entries = journal.entries || {}; // ensure entries is an object
		journal.entries[p] = journal.entries[p] || {}; // ensure entries.date is an object
		journal.entries[p].checkbox = journal.entries[p].checkbox || {}; // ensure entries.date.checkbox is an object
		if (!($.isEmptyObject(journal.entries[p].checkbox))) {
			//something has been checked on this day
			var checkboxes = $(document.getElementById(p)).children().children();
			for (var pp in journal.entries[p].checkbox) {
				if (journal.entries[p].checkbox[pp]) {
					for (var i = 0; i < checkboxes.length; i++) {
						if (checkboxes[i].value == pp) checkboxes[i].checked = true;
					} 
				}
			}
		}
		lastDateShown = p;
	}	
}

function editEntry(id) {
	//temporary: 
	//TODO: DELETE THIS:
		console.log(id);
		if (confirm("Delete this item? ("+id+")"))
			$('#'+id).fadeOut('slow');
	/*TODO: 
	concept, maybe: 
				    if($(this).is(":checked")) // "this" refers to the checkbox element that fired the event
				    {
						journal.entries[dateOfCheckbox].checkbox[val] = true;
						save(journal);
				    }
					else {
						delete journal.entries[dateOfCheckbox].checkbox[val];
						if ($.isEmptyObject(journal.entries[dateOfCheckbox].checkbox)) delete journal.entries[dateOfCheckbox].checkbox;
						if ($.isEmptyObject(journal.entries[dateOfCheckbox])) delete journal.entries[dateOfCheckbox];
						if ($.isEmptyObject(journal.entries)) delete journal.entries;
						save(journal);
					}
	 */
}

function addFood(foodElement) {
	var date = getDate(), foodEntry = document.getElementById(foodElement), entry = foodEntry.value;
	if (date != journal.today) {
		makeEntry();
		$("#food_entries").prepend("<li class='food_entry'>"+entry+"</li>");
		foodEntry.value = "";
		journal.today = date;
	}
	else {
		$("#food_entries").prepend("<li class='food_entry'>"+entry+"</li>");
		foodEntry.value = "";
	}
	journal.entries = journal.entries || {};
	journal.entries[date] = journal.entries[date] || {};
	journal.entries[date].food ? journal.entries[date].food.push(entry) : (journal.entries[date].food = [], journal.entries[date].food.push(entry)); 
	save(journal);
}

function addSymptom(symptomElement) {
	var date = getDate(), symptomEntry = document.getElementById(symptomElement), entry = symptomEntry.value;
	if (date != journal.today) {
		makeEntry();
		$("#symptom_entries").prepend("<li class='symptom_entry'>"+entry+"</li>");
		symptomEntry.value = "";
		journal.today = date;
	}
	else {
		$("#symptom_entries").prepend("<li class='symptom_entry'>"+entry+"</li>");
		symptomEntry.value = "";
	}
	journal.entries = journal.entries || {};
	journal.entries[date] = journal.entries[date] || {};
	journal.entries[date].symptoms ? journal.entries[date].symptoms.push(entry) : (journal.entries[date].symptoms = [], journal.entries[date].symptoms.push(entry)); 	save(journal);
}

function getDate() {
	var now = new Date();
	var day = now.getDate();
	var month = now.getMonth();
	var year = now.getFullYear();
	var date = String(Number(month+1))+"/"+String(day)+"/"+String(year);
	return date;
}

function save(obj) {
	localStorage.journal = JSON.stringify(obj);
}

function keyPress(event, element, func) {
	if (event.keyCode == 13)
		func(element);
}
