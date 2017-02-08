$(document).ready(function(){
	var dom = {
		'dateInput': $('#date-input'),
		'calendarHolder': $('.calendar-holder')
	},
	monthsTemplateSource = $('#months-template').html(),
	yearBarTemplSource = $('#year-bar-template').html(),
	yearBarTemplate = Handlebars.compile(yearBarTemplSource),
	monthsTemplate = Handlebars.compile(monthsTemplateSource),
	monthTemplateSource = $('#month-template').html(),
	monthTemplate = Handlebars.compile(monthTemplateSource),
	currentYear = moment().get('year'),
	startYear = currentYear,
	endYear = currentYear+30,
	showMonth;
	
	while(startYear<=endYear) {
		dom.calendarHolder.append(yearBarTemplate({year: startYear})).append(monthsTemplate({year: startYear}));
		startYear++;
	}
	dom.yearBar = $('.year-bar');
	dom.month = $('.month');
	dom.dateInput.on('focus',function(e){
		dom.calendarHolder.show();
	});
	
	dom.yearBar.on('click',function(e){
		var restYears,
			selectedYear = e.currentTarget.dataset.year;
		restYears = dom.yearBar.filter(function(index,bar){
			return bar.dataset.year !== selectedYear;
		});
		restYears.each(function(){
			$(this).removeClass('expanded').addClass('collapsed');
			$(this).find('.arrow').removeClass('arrow-up').addClass('arrow-down');
			$(this).find('.days').hide();
			$(this).find('.month-selected').html("");
			$(this).next().hide();
			if($(this).hasClass('month-view')) {
				$(this).next().next().hide();
			}
		});
		
		if($(this).hasClass('month-view')) {
			$(this).siblings('.month-wrapper').hide();
			$(this).find('.month-selected').html("");
			$(this).removeClass('month-view');
			$(this).find('.days').hide();
			$(this).next().show();
		} else {
			$(this).toggleClass('collapsed').toggleClass('expanded');
			$(this).next().toggle();
			$(this).find('.arrow').toggleClass('arrow-down').toggleClass('arrow-up');
		}
	});
	dom.month.on('click',function(){
		var monthDays,year,month,prevMonth,nextMonth,monthsWrapper,yearBar;
		dom.month.removeClass('selected');
		monthsWrapper = $(this).addClass('selected').parents('.months-wrapper');
		monthsWrapper.prev().addClass('month-view').find('.month-selected').html($(this).html());
		year = Number(this.dataset.year);
		month = Number(this.dataset.month);
		prevMonth = month-1==0?12:month-1;
		nextMonth = month+1==12?1:month+1;
		yearBar = $(monthsWrapper).prev();
		yearBar.find('.days').toggle();
		if(month === 1) {
			yearBar.find('.next-month-pointer').data({'month':month,'year':year,'nextMonth':nextMonth}).show();
		} else if (month === 12) {
			yearBar.find('.prev-month-pointer').data({'month':month,'year':year,'prevMonth':prevMonth}).show();
		} else {
			yearBar.find('.next-month-pointer').data({'month':month,'year':year,'nextMonth':nextMonth,'prevMonth':prevMonth}).show();
			yearBar.find('.prev-month-pointer').data({'month':month,'year':year,'prevMonth':prevMonth,'nextMonth':nextMonth}).show();
		}

		showMonth(month,year,prevMonth,nextMonth,monthsWrapper);
	});

	showMonth = function showMonth(month,year,prevMonth,nextMonth,monthsWrapper) {
		var monthStartDay,
			prevMonthDays,
			monthEndDay,
			nextMonthDays,
			monthDays,
			datesToShow=[],
			currentDate = moment().get('date'),
			currentMonth = moment().get('month'),
			currentYear = moment().get('year');
		monthStartDay = moment(year+"-"+month+"-"+1).day();
		prevMonthDays = moment(year+"-"+prevMonth,"YYYY-MM").daysInMonth();
		monthDays = moment(year+"-"+month,"YYYY-MM").daysInMonth();
		monthEndDay = moment(year+"-"+month+"-"+monthDays).day();
		nextMonthDays = moment(year+"-"+nextMonth,"YYYY-MM").daysInMonth();
		preDates = monthStartDay;
		postDates = 7-(monthEndDay+1);

		for(var i=1;i<=preDates;i++) {
			datesToShow.push({'date':(prevMonthDays-(preDates-i)),'class':'date old-date'});
		}
		for(var i=1;i<=monthDays;i++) {
			if(currentDate === i && currentMonth+1 === month && currentYear === year) {
				datesToShow.push({'date':i,'class':'date current-date valid-date','month':month,'year':year});
			} else {
				datesToShow.push({'date':i,'class':'date valid-date','month':month,'year':year});
			}
		}
		for(var i=1;i<=postDates;i++) {
			datesToShow.push({'date':i,'class':'date future-date'});
		}
		$(monthsWrapper).hide().after(monthTemplate({'dates':datesToShow}));
		$('.month-wrapper').on('click','.valid-date',function(e){
			var year = e.currentTarget.dataset.year,
				month = e.currentTarget.dataset.month,
				date = e.currentTarget.dataset.date;
			$('.valid-date').removeClass('date-selected');
			$(e.currentTarget).addClass('date-selected');
			month = month<10?"0"+month:month;
			date = date<10?"0"+date:date
			$('#date-input').val(year+"/"+month+"/"+date);
			dom.calendarHolder.hide();
		});
	}
	$(document).on('click',function(e){
		if($(e.target).parents('.calendar-holder').length === 0 && $(e.target).attr('id') !== 'date-input') {
			dom.calendarHolder.hide();
		}
	})
});