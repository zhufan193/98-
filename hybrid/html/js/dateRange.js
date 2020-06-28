function pickerDateRange(inputId, options) {
    var defaults = {
        aToday: 'aToday',
        aYesterday: 'aYesterday',
        aRecent7Days: 'aRecent7Days',
        aRecent14Days: 'aRecent14Days',
        aRecent30Days: 'aRecent30Days',
        aRecent90Days: 'aRecent90Days',
        startDate: '',
        endDate: '',
        startCompareDate: '',
        endCompareDate: '',
        minValidDate: '315507600',
        maxValidDate: '',
        success: function(obj) {
            return true;
        },
        startDateId: 'startDate',
        startCompareDateId: 'startCompareDate',
        endDateId: 'endDate',
        endCompareDateId: 'endCompareDate',
        target: '',
        needCompare: false,
        suffix: '',
        inputTrigger: 'input_trigger',
        compareTrigger: 'compare_trigger',
        compareCheckboxId: 'needCompare',
        calendars: 1,
        dayRangeMax: 0,
        monthRangeMax: 12,
        dateTable: 'dateRangeDateTable',
        selectCss: 'dateRangeSelected',
        compareCss: 'dateRangeCompare',
        coincideCss: 'dateRangeCoincide',
        firstCss: 'first',
        lastCss: 'last',
        clickCss: 'today',
        disableGray: 'dateRangeGray',
        isToday: 'dateRangeToday',
        joinLineId: 'joinLine',
        isSingleDay: false,
        defaultText: ' 至 ',
        singleCompare: false,
        stopToday: true,
        isTodayValid: false,
        weekendDis: false,
        disCertainDay: [],
        disCertainDate: [],
        shortOpr: false,
        noCalendar: false,
        theme: 'gri',
        magicSelect: false,
        autoCommit: false,
        autoSubmit: false,
        replaceBtn: 'btn_compare'
    };
    var __method = this;
    this.inputId = inputId;
    this.inputCompareId = inputId + 'Compare';
    this.compareInputDiv = 'div_compare_' + inputId;
    this.mOpts = $.extend({}, defaults, options);
    this.mOpts.calendars = Math.min(this.mOpts.calendars, 3);
    this.mOpts.compareCss = this.mOpts.theme == 'ta' ? this.mOpts.selectCss : this.mOpts.compareCss
    this.periodObj = {};
    this.periodObj[__method.mOpts.aToday] = 0;
    this.periodObj[__method.mOpts.aYesterday] = 1;
    this.periodObj[__method.mOpts.aRecent7Days] = 6;
    this.periodObj[__method.mOpts.aRecent14Days] = 13;
    this.periodObj[__method.mOpts.aRecent30Days] = 29;
    this.periodObj[__method.mOpts.aRecent90Days] = 89;
    this.startDefDate = '';
    var suffix = '' == this.mOpts.suffix ? (new Date()).getTime() : this.mOpts.suffix;
    this.calendarId = 'calendar_' + suffix;
    this.dateListId = 'dateRangePicker_' + suffix;
    this.dateRangeCompareDiv = 'dateRangeCompareDiv_' + suffix;
    this.dateRangeDiv = 'dateRangeDiv_' + suffix;
    this.compareCheckBoxDiv = 'dateRangeCompareCheckBoxDiv_' + suffix;
    this.submitBtn = 'submit_' + suffix;
    this.closeBtn = 'closeBtn_' + suffix;
    this.preMonth = 'dateRangePreMonth_' + suffix;
    this.nextMonth = 'dateRangeNextMonth_' + suffix;
    this.startDateId = this.mOpts.startDateId + '_' + suffix;
    this.endDateId = this.mOpts.endDateId + '_' + suffix;
    this.compareCheckboxId = this.mOpts.compareCheckboxId + '_' + suffix;
    this.startCompareDateId = this.mOpts.startCompareDateId + '_' + suffix;
    this.endCompareDateId = this.mOpts.endCompareDateId + '_' + suffix;
    var wrapper = {
        gri: ['<div id="' + this.calendarId + '" class="gri_dateRangeCalendar">', '<table class="gri_dateRangePicker"><tr id="' + this.dateListId + '"></tr></table>', '<div class="gri_dateRangeOptions" ' + (this.mOpts.autoSubmit ? ' style="display:none" ' : '') + '>', '<div class="gri_dateRangeInput" id="' + this.dateRangeDiv + '" >', '<input type="text" class="gri_dateRangeInput" name="' + this.startDateId + '" id="' + this.startDateId + '" value="' + this.mOpts.startDate + '" readonly />', '<span id="' + this.mOpts.joinLineId + '"> - </span>', '<input type="text" class="gri_dateRangeInput" name="' + this.endDateId + '" id="' + this.endDateId + '" value="' + this.mOpts.endDate + '" readonly /><br />', '</div>', '<div class="gri_dateRangeInput" id="' + this.dateRangeCompareDiv + '">', '<input type="text" class="gri_dateRangeInput" name="' + this.startCompareDateId + '" id="' + this.startCompareDateId + '" value="' + this.mOpts.startCompareDate + '" readonly />', '<span class="' + this.mOpts.joinLineId + '"> - </span>', '<input type="text" class="gri_dateRangeInput" name="' + this.endCompareDateId + '" id="' + this.endCompareDateId + '" value="' + this.mOpts.endCompareDate + '" readonly />', '</div>', '<div>', '<input type="button" name="' + this.submitBtn + '" id="' + this.submitBtn + '" value="确定" />', '&nbsp;<a id="' + this.closeBtn + '" href="javascript:;">关闭</a>', '</div>', '</div>', '</div>'],
        ta: ['<div id="' + this.calendarId + '" class="ta_calendar ta_calendar2">', '<div class="ta_calendar_cont cf" id="' + this.dateListId + '">', '</div>', '<div class="ta_calendar_footer" ' + (this.mOpts.autoSubmit ? ' style="display:none" ' : '') + '>', '<div class="frm_btn">', '<input class="ta_btn" type="button" id="' + this.closeBtn + '" value="取消"/>', '</div>', '<div class="frm_msg">', '<div id="' + this.dateRangeDiv + '">', '<input type="text" class="ta_ipt_text_s" name="' + this.startDateId + '" id="' + this.startDateId + '" value="' + this.mOpts.startDate + '" readonly />', '<span class="' + this.mOpts.joinLineId + '"> - </span>', '<input type="text" class="ta_ipt_text_s" name="' + this.endDateId + '" id="' + this.endDateId + '" value="' + this.mOpts.endDate + '" readonly /><br />', '</div>', '<div id="' + this.dateRangeCompareDiv + '">', '<input type="text" class="ta_ipt_text_s" name="' + this.startCompareDateId + '" id="' + this.startCompareDateId + '" value="' + this.mOpts.startCompareDate + '" readonly />', '<span class="' + this.mOpts.joinLineId + '"> - </span>', '<input type="text" class="ta_ipt_text_s" name="' + this.endCompareDateId + '" id="' + this.endCompareDateId + '" value="' + this.mOpts.endCompareDate + '" readonly />', '</div>', '</div>', '<div class="frm_btn">', '<input class="ta_btn ta_btn_primary" type="button" name="' + this.submitBtn + '" id="' + this.submitBtn + '" value="确定" />', '</div>', '</div>', '<div id="mask" class="mask">', '</div>', '</div>']
    };
    var checkBoxWrapper = {
        gri: ['<label class="gri_contrast" for ="' + this.compareCheckboxId + '">', '<input type="checkbox" class="gri_pc" name="' + this.compareCheckboxId + '" id="' + this.compareCheckboxId + '" value="1"/>对比', '</label>', '<input type="text" name="' + this.inputCompareId + '" id="' + this.inputCompareId + '" value="" class="gri_date"/>'],
        ta: ['<label class="contrast" for ="' + this.compareCheckboxId + '">', '<input type="checkbox" class="pc" name="' + this.compareCheckboxId + '" id="' + this.compareCheckboxId + '" value="1"/>对比', '</label>', '<div class="ta_date" id="' + this.compareInputDiv + '">', '	<span name="dateCompare" id="' + this.inputCompareId + '" class="date_title"></span>', '	<a class="opt_sel" id="' + this.mOpts.compareTrigger + '" href="#">', '		<i class="i_orderd"></i>', '	</a>', '</div>']
    };
    if (this.mOpts.theme == 'ta') {
        $(checkBoxWrapper[this.mOpts.theme].join('')).insertAfter($('#div_' + this.inputId));
    } else {
        $(checkBoxWrapper[this.mOpts.theme].join('')).insertAfter($('#' + this.inputId));
    }
    if (this.mOpts.noCalendar) {
        $('#' + this.inputId).css('display', 'none');
        $('#' + this.compareCheckboxId).parent().css('display', 'none');
    }
    $(0 < $('#appendParent').length ? '#appendParent' : document.body).append(wrapper[this.mOpts.theme].join(''));
    $('#' + this.calendarId).css('z-index', 9999);
    if (1 > $('#' + this.mOpts.startDateId).length) {
        $('' != this.mOpts.target ? '#' + this.mOpts.target : 'body').append('<input type="hidden" id="' + this.mOpts.startDateId + '" name="' + this.mOpts.startDateId + '" value="' + this.mOpts.startDate + '" />');
    } else {
        $('#' + this.mOpts.startDateId).val(this.mOpts.startDate);
    }
    if (1 > $('#' + this.mOpts.endDateId).length) {
        $('' != this.mOpts.target ? '#' + this.mOpts.target : 'body').append('<input type="hidden" id="' + this.mOpts.endDateId + '" name="' + this.mOpts.endDateId + '" value="' + this.mOpts.endDate + '" />');
    } else {
        $('#' + this.mOpts.endDateId).val(this.mOpts.endDate);
    }
    if (1 > $('#' + this.mOpts.compareCheckboxId).length) {
        $('' != this.mOpts.target ? '#' + this.mOpts.target : 'body').append('<input type="checkbox" id="' + this.mOpts.compareCheckboxId + '" name="' + this.mOpts.compareCheckboxId + '" value="0" style="display:none;" />');
    }
    if (false == this.mOpts.needCompare) {
        $('#' + this.compareInputDiv).css('display', 'none');
        $('#' + this.compareCheckBoxDiv).css('display', 'none');
        $('#' + this.dateRangeCompareDiv).css('display', 'none');
        $('#' + this.compareCheckboxId).attr('disabled', true);
        $('#' + this.startCompareDateId).attr('disabled', true);
        $('#' + this.endCompareDateId).attr('disabled', true);
        $('#' + this.compareCheckboxId).parent().css('display', 'none');
        $('#' + this.mOpts.replaceBtn).length > 0 && $('#' + this.mOpts.replaceBtn).hide();
    } else {
        if (1 > $('#' + this.mOpts.startCompareDateId).length) {
            $('' != this.mOpts.target ? '#' + this.mOpts.target : 'body').append('<input type="hidden" id="' + this.mOpts.startCompareDateId + '" name="' + this.mOpts.startCompareDateId + '" value="' + this.mOpts.startCompareDate + '" />');
        } else {
            $('#' + this.mOpts.startCompareDateId).val(this.mOpts.startCompareDate);
        }
        if (1 > $('#' + this.mOpts.endCompareDateId).length) {
            $('' != this.mOpts.target ? '#' + this.mOpts.target : 'body').append('<input type="hidden" id="' + this.mOpts.endCompareDateId + '" name="' + this.mOpts.endCompareDateId + '" value="' + this.mOpts.endCompareDate + '" />');
        } else {
            $('#' + this.mOpts.endCompareDateId).val(this.mOpts.endCompareDate);
        }
        if ('' == this.mOpts.startCompareDate || '' == this.mOpts.endCompareDate) {
            $('#' + this.compareCheckboxId).attr('checked', false);
            $('#' + this.mOpts.compareCheckboxId).attr('checked', false);
        } else {
            $('#' + this.compareCheckboxId).attr('checked', true);
            $('#' + this.mOpts.compareCheckboxId).attr('checked', true);
        }
    }
    this.dateInput = this.startDateId;
    this.changeInput(this.dateInput);
    $('#' + this.startDateId).bind('click', function() {
        if (__method.endCompareDateId == __method.dateInput) {
            $('#' + __method.startCompareDateId).val(__method.startDefDate);
        }
        __method.startDefDate = '';
        __method.removeCSS(1);
        __method.changeInput(__method.startDateId);
        return false;
    });
    $('#' + this.calendarId).bind('click', function(event) {
        event.stopPropagation();
    });
    $('#' + this.startCompareDateId).bind('click', function() {
        if (__method.endDateId == __method.dateInput) {
            $('#' + __method.startDateId).val(__method.startDefDate);
        }
        __method.startDefDate = '';
        __method.removeCSS(0);
        __method.changeInput(__method.startCompareDateId);
        return false;
    });
    $('#' + this.submitBtn).bind('click', function() {
        __method.close(1);
        __method.mOpts.success({
            'startDate': $('#' + __method.mOpts.startDateId).val(),
            'endDate': $('#' + __method.mOpts.endDateId).val(),
            'needCompare': $('#' + __method.mOpts.compareCheckboxId).val(),
            'startCompareDate': $('#' + __method.mOpts.startCompareDateId).val(),
            'endCompareDate': $('#' + __method.mOpts.endCompareDateId).val()
        });
        return false;
    });
    $('#' + this.closeBtn).bind('click', function() {
        __method.close();
        return false;
    });
    $('#' + this.inputId).bind('click', function() {
        __method.init();
        __method.show(false, __method);
        return false;
    });
    $('#' + this.mOpts.inputTrigger).bind('click', function() {
        __method.init();
        __method.show(false, __method);
        return false;
    });
    $('#' + this.mOpts.compareTrigger).bind('click', function() {
        __method.init(true);
        __method.show(true, __method);
        return false;
    });
    $('#' + this.inputCompareId).bind('click', function() {
        __method.init(true);
        __method.show(true, __method);
        return false;
    });
    if (this.mOpts.singleCompare) {
        if (this.mOpts.theme === 'ta') {
            $('#' + __method.startDateId).val(__method.mOpts.startDate);
            $('#' + __method.endDateId).val(__method.mOpts.startDate);
            $('#' + __method.startCompareDateId).val(__method.mOpts.startCompareDate);
            $('#' + __method.endCompareDateId).val(__method.mOpts.startCompareDate);
        } else {
            $('#' + __method.startDateId).val(__method.mOpts.startDate);
            $('#' + __method.endDateId).val(__method.mOpts.startDate);
            $('#' + __method.startCompareDateId).val(__method.mOpts.startCompareDate);
            $('#' + __method.endCompareDateId).val(__method.mOpts.startCompareDate);
            $('#' + this.compareCheckboxId).attr('checked', true);
            $('#' + this.mOpts.compareCheckboxId).attr('checked', true);
        }
    }
    $('#' + this.dateRangeCompareDiv).css('display', $('#' + this.compareCheckboxId).attr('checked') ? '' : 'none');
    $('#' + this.compareInputDiv).css('display', $('#' + this.compareCheckboxId).attr('checked') ? '' : 'none');
    $('#' + this.compareCheckboxId).bind('click', function() {
        $('#' + __method.inputCompareId).css('display', this.checked ? '' : 'none');
        $('#' + __method.dateRangeCompareDiv).css('display', this.checked ? '' : 'none');
        $('#' + __method.compareInputDiv).css('display', this.checked ? '' : 'none');
        $('#' + __method.startCompareDateId).css('disabled', this.checked ? false : true);
        $('#' + __method.endCompareDateId).css('disabled', this.checked ? false : true);
        $('#' + __method.mOpts.compareCheckboxId).attr('checked', $('#' + __method.compareCheckboxId).attr('checked'));
        $('#' + __method.mOpts.compareCheckboxId).val($('#' + __method.compareCheckboxId).attr('checked') ? 1 : 0);
        if ($('#' + __method.compareCheckboxId).attr('checked')) {
            sDate = __method.str2date($('#' + __method.startDateId).val());
            sTime = sDate.getTime();
            eDate = __method.str2date($('#' + __method.endDateId).val());
            eTime = eDate.getTime();
            scDate = $('#' + __method.startCompareDateId).val();
            ecDate = $('#' + __method.endCompareDateId).val();
            if ('' == scDate || '' == ecDate) {
                ecDate = __method.str2date(__method.date2ymd(sDate).join('-'));
                ecDate.setDate(ecDate.getDate() - 1);
                scDate = __method.str2date(__method.date2ymd(sDate).join('-'));
                scDate.setDate(scDate.getDate() - ((eTime - sTime) / 86400000) - 1);
                if (ecDate.getTime() < __method.mOpts.minValidDate * 1000) {
                    scDate = sDate;
                    ecDate = eDate;
                }
                if (ecDate.getTime() >= __method.mOpts.minValidDate * 1000 && scDate.getTime() < __method.mOpts.minValidDate * 1000) {
                    scDate.setTime(__method.mOpts.minValidDate * 1000)
                    scDate = __method.str2date(__method.date2ymd(scDate).join('-'));
                    ecDate.setDate(scDate.getDate() + ((eTime - sTime) / 86400000) - 1);
                }
                $('#' + __method.startCompareDateId).val(__method.formatDate(__method.date2ymd(scDate).join('-')));
                $('#' + __method.endCompareDateId).val(__method.formatDate(__method.date2ymd(ecDate).join('-')));
            }
            __method.addCSS(1);
            __method.changeInput(__method.startCompareDateId);
        } else {
            __method.removeCSS(1);
            __method.changeInput(__method.startDateId);
        }
        __method.close(1);
        __method.mOpts.success({
            'startDate': $('#' + __method.mOpts.startDateId).val(),
            'endDate': $('#' + __method.mOpts.endDateId).val(),
            'needCompare': $('#' + __method.mOpts.compareCheckboxId).val(),
            'startCompareDate': $('#' + __method.mOpts.startCompareDateId).val(),
            'endCompareDate': $('#' + __method.mOpts.endCompareDateId).val()
        });
    });
    this.init();
    this.close(1);
    if (this.mOpts.replaceBtn && $('#' + this.mOpts.replaceBtn).length > 0) {
        $('#' + __method.compareCheckboxId).hide();
        $('.contrast').hide();
        $('#' + this.mOpts.replaceBtn).bind('click', function() {
            var self = this;
            $('#' + __method.compareCheckboxId).attr('checked') ? $('#' + __method.compareCheckboxId).removeAttr('checked') : $('#' + __method.compareCheckboxId).attr('checked', 'checked');
            $('#' + __method.compareCheckboxId).click();
            $('#' + __method.compareCheckboxId).attr('checked') ? function() {
                $('#' + __method.compareCheckboxId).removeAttr('checked');
                $('.contrast').hide();
                $(self).text('按时间对比');
            }() : function() {
                $('#' + __method.compareCheckboxId).attr('checked', 'checked');
                $('.contrast').show();
                $(self).text('取消对比');
            }();
        });
    }
    if (this.mOpts.autoCommit) {
        this.mOpts.success({
            'startDate': $('#' + __method.mOpts.startDateId).val(),
            'endDate': $('#' + __method.mOpts.endDateId).val(),
            'needCompare': $('#' + __method.mOpts.compareCheckboxId).val(),
            'startCompareDate': $('#' + __method.mOpts.startCompareDateId).val(),
            'endCompareDate': $('#' + __method.mOpts.endCompareDateId).val()
        });
    }
    $(document).bind('click', function() {
        __method.close();
    });
}
;pickerDateRange.prototype.init = function(isCompare) {
    var __method = this;
    var minDate, maxDate;
    var isNeedCompare = typeof (isCompare) != 'undefined' ? isCompare && $("#" + __method.compareCheckboxId).attr('checked') : $("#" + __method.compareCheckboxId).attr('checked');
    $("#" + this.dateListId).empty();
    var endDate = '' == this.mOpts.endDate ? (new Date()) : this.str2date(this.mOpts.endDate);
    this.calendar_endDate = new Date(endDate.getFullYear(),endDate.getMonth() + 1,0);
    if (this.mOpts.magicSelect && this.mOpts.theme == 'ta') {
        var i = 0;
        do {
            var td = null;
            if (i == 0) {
                td = this.fillDate(this.str2date($('#' + this.endDateId).val()).getFullYear(), this.str2date($('#' + this.endDateId).val()).getMonth(), i);
                $("#" + this.dateListId).append(td);
            } else {
                td = this.fillDate(this.str2date($('#' + this.startDateId).val()).getFullYear(), this.str2date($('#' + this.startDateId).val()).getMonth(), i);
                var firstTd = (this.mOpts.theme == 'ta' ? $("#" + this.dateListId).find('table').get(0) : $("#" + this.dateListId).find('td').get(0));
                $(firstTd).before(td);
            }
            i++;
        } while (i < 2);this.calendar_startDate = new Date(this.str2date($('#' + this.startDateId).val()).getFullYear(),this.str2date($('#' + this.startDateId).val()).getMonth(),1);
    } else {
        for (var i = 0; i < this.mOpts.calendars; i++) {
            var td = null;
            if (this.mOpts.theme == 'ta') {
                td = this.fillDate(endDate.getFullYear(), endDate.getMonth(), i);
            } else {
                td = document.createElement('td');
                $(td).append(this.fillDate(endDate.getFullYear(), endDate.getMonth(), i));
                $(td).css('vertical-align', 'top');
            }
            if (0 == i) {
                $("#" + this.dateListId).append(td);
            } else {
                var firstTd = (this.mOpts.theme == 'ta' ? $("#" + this.dateListId).find('table').get(0) : $("#" + this.dateListId).find('td').get(0));
                $(firstTd).before(td);
            }
            endDate.setMonth(endDate.getMonth() - 1, 1);
        }
        this.calendar_startDate = new Date(endDate.getFullYear(),endDate.getMonth() + 1,1);
    }
    $('#' + this.preMonth).bind('click', function() {
        __method.calendar_endDate.setMonth(__method.calendar_endDate.getMonth() - 1, 1);
        __method.mOpts.endDate = __method.date2ymd(__method.calendar_endDate).join('-');
        __method.init(isCompare);
        if (1 == __method.mOpts.calendars) {
            if ('' == $('#' + __method.startDateId).val()) {
                __method.changeInput(__method.startDateId);
            } else {
                __method.changeInput(__method.endDateId);
            }
        }
        return false;
    });
    $('#' + this.nextMonth).bind('click', function() {
        __method.calendar_endDate.setMonth(__method.calendar_endDate.getMonth() + 1, 1);
        __method.mOpts.endDate = __method.date2ymd(__method.calendar_endDate).join('-');
        __method.init(isCompare);
        if (1 == __method.mOpts.calendars) {
            if ('' == $('#' + __method.startDateId).val()) {
                __method.changeInput(__method.startDateId);
            } else {
                __method.changeInput(__method.endDateId);
            }
        }
        return false;
    });
    if (this.mOpts.magicSelect)
        this.bindChangeForSelect();
    if (this.endDateId != this.dateInput && this.endCompareDateId != this.dateInput) {
        (isNeedCompare && typeof (isCompare) != 'undefined') ? this.addCSS(1) : this.addCSS(0);
    }
    if (isNeedCompare && typeof (isCompare) != 'undefined') {
        __method.addCSS(1);
    } else {
        __method.addCSS(0);
    }
    $('#' + __method.inputCompareId).css('display', isNeedCompare ? '' : 'none');
    $('#' + this.compareInputDiv).css('display', $('#' + this.compareCheckboxId).attr('checked') ? '' : 'none');
    for (var property in __method.periodObj) {
        if ($('#' + property).length > 0) {
            $('#' + property).unbind('click');
            $('#' + property).bind('click', function() {
                var cla = __method.mOpts.theme == 'ta' ? 'active' : 'a';
                $(this).parent().nextAll().removeClass(cla);
                $(this).parent().prevAll().removeClass(cla);
                $(this).parent().addClass(cla);
                var timeObj = __method.getSpecialPeriod(__method.periodObj[$(this).attr('id')]);
                $('#' + __method.startDateId).val(__method.formatDate(timeObj.otherday));
                $('#' + __method.endDateId).val(__method.formatDate(timeObj.today));
                $('#' + __method.mOpts.startDateId).val($('#' + __method.startDateId).val());
                $('#' + __method.mOpts.endDateId).val($('#' + __method.endDateId).val());
                __method.mOpts.theme == 'ta' ? $('#' + __method.compareInputDiv).hide() : $('#' + __method.inputCompareId).css('display', 'none');
                $('#' + __method.compareCheckboxId).attr('checked', false);
                $('#' + __method.mOpts.compareCheckboxId).attr('checked', false);
                $('#' + this.compareInputDiv).css('display', $('#' + this.compareCheckboxId).attr('checked') ? '' : 'none');
                __method.close(1);
                $('#' + __method.startCompareDateId).val('');
                $('#' + __method.endCompareDateId).val('');
                $('#' + __method.mOpts.startCompareDateId).val('');
                $('#' + __method.mOpts.endCompareDateId).val('');
                $('#' + __method.mOpts.compareCheckboxId).val(0);
                if ($('#' + __method.mOpts.replaceBtn).length > 0) {
                    $('.contrast').hide();
                    $('#' + __method.mOpts.replaceBtn).text('按时间对比');
                }
                __method.mOpts.success({
                    'startDate': $('#' + __method.mOpts.startDateId).val(),
                    'endDate': $('#' + __method.mOpts.endDateId).val(),
                    'needCompare': $('#' + __method.mOpts.compareCheckboxId).val(),
                    'startCompareDate': $('#' + __method.mOpts.startCompareDateId).val(),
                    'endCompareDate': $('#' + __method.mOpts.endCompareDateId).val()
                });
            });
        }
    }
    $(document).bind('click', function() {
        __method.close();
    });
    $('#' + this.inputId).bind('change', function() {
        if ($(this).val() === '') {
            $('#' + __method.startDateId).val('');
            $('#' + __method.endDateId).val('');
            $('#' + __method.startCompareDateId).val('');
            $('#' + __method.endCompareDateId).val('');
        }
    })
}
;
pickerDateRange.prototype.bindChangeForSelect = function() {
    var __method = this;
    var _popup = function(btn, ctn, wrap, css) {
        css = css || 'open';
        var ITEMS_TIMEOUT = null
          , time_out = 500;
        function hidePop() {
            $('#' + ctn).removeClass(css);
        }
        function showPop() {
            $('#' + ctn).addClass(css);
        }
        function isPopShow() {
            return $('#' + ctn).attr('class') == css;
        }
        $("#" + btn).click(function() {
            isPopShow() ? hidePop() : showPop();
        }).mouseover(function() {
            clearTimeout(ITEMS_TIMEOUT);
        }).mouseout(function() {
            ITEMS_TIMEOUT = setTimeout(hidePop, time_out);
        });
        $('#' + wrap).mouseover(function() {
            clearTimeout(ITEMS_TIMEOUT);
        }).mouseout(function() {
            ITEMS_TIMEOUT = setTimeout(hidePop, time_out);
        });
    };
    try {
        $("#" + this.dateListId).find('div[id*="selected"]').each(function() {
            var _match = $(this).attr('id').match(/(\w+)_(\d)/i);
            if (_match) {
                var _name = _match[1];
                var _idx = _match[2];
                if (_name == 'yselected') {
                    _popup('_ybtn_' + _idx, $(this).attr('id'), '_yctn_' + _idx);
                } else if (_name == 'mselected') {
                    _popup('_mbtn_' + _idx, $(this).attr('id'), '_mctn_' + _idx);
                }
                $(this).find('li a').each(function() {
                    $(this).click(function() {
                        var match = $(this).parents('.select_wrap').attr('id').match(/(\w+)_(\d)/i);
                        var name = match[1];
                        var idx = match[2];
                        var nt = null;
                        if (idx ^ 1 == 0) {
                            if (name == 'yselected') {
                                __method.calendar_startDate.setYear($(this).text() * 1, 1);
                            } else if (name = 'mselected') {
                                __method.calendar_startDate.setMonth($(this).text() * 1 - 1, 1);
                            }
                            __method.mOpts.startDate = __method.date2ymd(__method.calendar_startDate).join('-');
                            nt = __method.fillDate(__method.calendar_startDate.getFullYear(), __method.calendar_startDate.getMonth(), idx);
                        } else {
                            if (name == 'yselected') {
                                __method.calendar_endDate.setYear($(this).text() * 1, 1);
                            } else if (name = 'mselected') {
                                __method.calendar_endDate.setMonth($(this).text() * 1 - 1, 1);
                            }
                            __method.mOpts.endDate = __method.date2ymd(__method.calendar_endDate).join('-');
                            nt = __method.fillDate(__method.calendar_endDate.getFullYear(), __method.calendar_endDate.getMonth(), idx);
                        }
                        var tb = $("#" + __method.dateListId).find('table').get(idx ^ 1);
                        $(tb).replaceWith(nt);
                        __method.removeCSS(0);
                        __method.bindChangeForSelect();
                    });
                });
            }
        });
    } catch (e) {
        window.console && console.log(e);
    }
}
pickerDateRange.prototype.getSpecialPeriod = function(period) {
    var __method = this;
    var date = new Date();
    (true == __method.mOpts.isTodayValid && ('' != __method.mOpts.isTodayValid) || 2 > period) ? '' : date.setTime(date.getTime() - (1 * 24 * 60 * 60 * 1000));
    var timeStamp = ((date.getTime() - (period * 24 * 60 * 60 * 1000)) < (__method.mOpts.minValidDate * 1000)) ? (__method.mOpts.minValidDate * 1000) : (date.getTime() - (period * 24 * 60 * 60 * 1000));
    var todayStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    date.setTime(timeStamp);
    var otherdayStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    if (period == __method.periodObj.aYesterday) {
        todayStr = otherdayStr;
    }
    return {
        today: todayStr,
        otherday: otherdayStr
    };
}
pickerDateRange.prototype.getCurrentDate = function() {
    return {
        'startDate': $('#' + this.mOpts.startDateId).val(),
        'endDate': $('#' + this.mOpts.endDateId).val(),
        'needCompare': $('#' + this.mOpts.compareCheckboxId).val(),
        'startCompareDate': $('#' + this.mOpts.startCompareDateId).val(),
        'endCompareDate': $('#' + this.mOpts.endCompareDateId).val()
    };
}
;
pickerDateRange.prototype.removeCSS = function(isCompare, specialClass) {
    if ('undefined' == typeof (specialClass)) {
        specialClass = this.mOpts.theme + '_' + this.mOpts.coincideCss;
    }
    if ('undefined' == typeof (isCompare)) {
        isCompare = 0;
    }
    var s_date = this.calendar_startDate;
    var e_date = this.calendar_endDate;
    if (this.mOpts.magicSelect) {
        s_date = this.str2date($('#' + this.startDateId).val());
        e_date = this.str2date($('#' + this.endDateId).val());
    }
    var bDate = new Date(s_date.getFullYear(),s_date.getMonth(),s_date.getDate());
    var cla = '';
    for (var d = new Date(bDate); d.getTime() <= e_date.getTime(); d.setDate(d.getDate() + 1)) {
        if (0 == isCompare) {
            cla = this.mOpts.theme + '_' + this.mOpts.selectCss;
        } else {
            cla = this.mOpts.theme + '_' + this.mOpts.compareCss;
        }
        $('#' + this.calendarId + '_' + this.date2ymd(d).join('-')).removeClass(cla);
        $('#' + this.calendarId + '_' + this.date2ymd(d).join('-')).removeClass(this.mOpts.firstCss).removeClass(this.mOpts.lastCss).removeClass(this.mOpts.clickCss);
    }
}
;
pickerDateRange.prototype.addCSS = function(isCompare, specialClass) {
    if ('undefined' == typeof (specialClass)) {
        specialClass = this.mOpts.theme + '_' + this.mOpts.coincideCss;
    }
    if ('undefined' == typeof (isCompare)) {
        isCompare = 0;
    }
    var startDate = this.str2date($('#' + this.startDateId).val());
    var endDate = this.str2date($('#' + this.endDateId).val());
    var startCompareDate = this.str2date($('#' + this.startCompareDateId).val());
    var endCompareDate = this.str2date($('#' + this.endCompareDateId).val());
    var sDate = 0 == isCompare ? startDate : startCompareDate;
    var eDate = 0 == isCompare ? endDate : endCompareDate;
    var cla = '';
    for (var d = new Date(sDate); d.getTime() <= eDate.getTime(); d.setDate(d.getDate() + 1)) {
        if (0 == isCompare) {
            cla = this.mOpts.theme + '_' + this.mOpts.selectCss;
            $('#' + this.calendarId + '_' + this.date2ymd(d).join('-')).removeClass(this.mOpts.firstCss).removeClass(this.mOpts.lastCss).removeClass(this.mOpts.clickCss);
            $('#' + this.calendarId + '_' + this.date2ymd(d).join('-')).removeClass(cla);
        } else {
            cla = this.mOpts.theme + '_' + this.mOpts.compareCss;
        }
        $('#' + this.calendarId + '_' + this.date2ymd(d).join('-')).attr('class', cla);
    }
    if (this.mOpts.theme == 'ta') {
        $('#' + this.calendarId + '_' + this.date2ymd(new Date(sDate)).join('-')).removeClass().addClass(this.mOpts.firstCss);
        $('#' + this.calendarId + '_' + this.date2ymd(new Date(eDate)).join('-')).removeClass().addClass(this.mOpts.lastCss);
        sDate.getTime() == eDate.getTime() && $('#' + this.calendarId + '_' + this.date2ymd(new Date(eDate)).join('-')).removeClass().addClass(this.mOpts.clickCss);
    }
}
;
pickerDateRange.prototype.checkDateRange = function(startYmd, endYmd) {
    var sDate = this.str2date(startYmd);
    var eDate = this.str2date(endYmd);
    var sTime = sDate.getTime();
    var eTime = eDate.getTime();
    var minEDate, maxEDate;
    if (eTime >= sTime) {
        maxEDate = this.str2date(startYmd);
        maxEDate.setMonth(maxEDate.getMonth() + this.mOpts.monthRangeMax);
        maxEDate.setDate(maxEDate.getDate() + this.mOpts.dayRangeMax - 1);
        if (maxEDate.getTime() < eTime) {
            alert('结束日期不能大于：' + this.date2ymd(maxEDate).join('-'));
            return false;
        }
    } else {
        maxEDate = this.str2date(endYmd);
        maxEDate.setMonth(maxEDate.getMonth() - this.mOpts.monthRangeMax);
        maxEDate.setDate(maxEDate.getDate() - this.mOpts.dayRangeMax + 1);
        if (maxEDate.getTime() > eTime) {
            alert('开始日期不能小于：' + this.date2ymd(maxEDate).join('-'));
            return false;
        }
    }
    return true;
}
pickerDateRange.prototype.selectDate = function(ymd) {
    this.changeInput(this.dateInput);
    var ymdFormat = this.formatDate(ymd);
    if (this.startDateId == this.dateInput) {
        this.removeCSS(0);
        this.removeCSS(1);
        $('#' + this.calendarId + '_' + ymd).attr('class', (this.mOpts.theme == 'ta' ? this.mOpts.clickCss : this.mOpts.theme + '_' + this.mOpts.selectCss));
        this.startDefDate = $('#' + this.dateInput).val();
        $('#' + this.dateInput).val(ymdFormat);
        if (true == this.mOpts.singleCompare || true == this.mOpts.isSingleDay) {
            this.dateInput = this.startDateId;
            $('#' + this.endDateId).val(ymdFormat);
            (this.mOpts.shortOpr || this.mOpts.autoSubmit) && this.close(1);
            this.mOpts.success({
                'startDate': $('#' + this.mOpts.startDateId).val(),
                'endDate': $('#' + this.mOpts.endDateId).val(),
                'needCompare': $('#' + this.mOpts.compareCheckboxId).val(),
                'startCompareDate': $('#' + this.mOpts.startCompareDateId).val(),
                'endCompareDate': $('#' + this.mOpts.endCompareDateId).val()
            });
        } else {
            this.dateInput = this.endDateId;
        }
    } else if (this.endDateId == this.dateInput) {
        if ('' == $('#' + this.startDateId).val()) {
            this.dateInput = this.startDateId;
            this.selectDate(ymd);
            return false;
        }
        if (false == this.checkDateRange($('#' + this.startDateId).val(), ymd)) {
            return false;
        }
        if (-1 == this.compareStrDate(ymd, $('#' + this.startDateId).val())) {
            $('#' + this.dateInput).val($('#' + this.startDateId).val());
            $('#' + this.startDateId).val(ymdFormat);
            ymdFormat = $('#' + this.dateInput).val();
        }
        $('#' + this.dateInput).val(ymdFormat);
        this.dateInput = this.startDateId;
        this.removeCSS(0);
        this.addCSS(0);
        this.startDefDate = '';
        if (this.mOpts.autoSubmit) {
            this.close(1);
            this.mOpts.success({
                'startDate': $('#' + this.mOpts.startDateId).val(),
                'endDate': $('#' + this.mOpts.endDateId).val(),
                'needCompare': $('#' + this.mOpts.compareCheckboxId).val(),
                'startCompareDate': $('#' + this.mOpts.startCompareDateId).val(),
                'endCompareDate': $('#' + this.mOpts.endCompareDateId).val()
            });
        }
    } else if (this.startCompareDateId == this.dateInput) {
        this.removeCSS(1);
        this.removeCSS(0);
        $('#' + this.calendarId + '_' + ymd).attr('class', (this.mOpts.theme == 'ta' ? this.mOpts.clickCss : this.mOpts.theme + '_' + this.mOpts.compareCss));
        this.startDefDate = $('#' + this.dateInput).val();
        $('#' + this.dateInput).val(ymdFormat);
        if (true == this.mOpts.singleCompare || true == this.mOpts.isSingleDay) {
            this.dateInput = this.startCompareDateId;
            $('#' + this.endCompareDateId).val(ymdFormat);
            (this.mOpts.shortOpr || this.mOpts.autoSubmit) && this.close(1);
            this.mOpts.success({
                'startDate': $('#' + this.mOpts.startDateId).val(),
                'endDate': $('#' + this.mOpts.endDateId).val(),
                'needCompare': $('#' + this.mOpts.compareCheckboxId).val(),
                'startCompareDate': $('#' + this.mOpts.startCompareDateId).val(),
                'endCompareDate': $('#' + this.mOpts.endCompareDateId).val()
            });
        } else {
            this.dateInput = this.endCompareDateId;
        }
    } else if (this.endCompareDateId == this.dateInput) {
        if ('' == $('#' + this.startCompareDateId).val()) {
            this.dateInput = this.startCompareDateId;
            this.selectDate(ymd);
            return false;
        }
        if (false == this.checkDateRange($('#' + this.startCompareDateId).val(), ymd)) {
            return false;
        }
        if (-1 == this.compareStrDate(ymd, $('#' + this.startCompareDateId).val())) {
            $('#' + this.dateInput).val($('#' + this.startCompareDateId).val());
            $('#' + this.startCompareDateId).val(ymdFormat);
            ymdFormat = $('#' + this.dateInput).val();
        }
        $('#' + this.dateInput).val(ymdFormat);
        this.dateInput = this.startCompareDateId;
        this.removeCSS(1);
        this.addCSS(1);
        this.startDefDate = '';
        if (this.mOpts.autoSubmit) {
            this.close(1);
            this.mOpts.success({
                'startDate': $('#' + this.mOpts.startDateId).val(),
                'endDate': $('#' + this.mOpts.endDateId).val(),
                'needCompare': $('#' + this.mOpts.compareCheckboxId).val(),
                'startCompareDate': $('#' + this.mOpts.startCompareDateId).val(),
                'endCompareDate': $('#' + this.mOpts.endCompareDateId).val()
            });
        }
    }
}
;
pickerDateRange.prototype.show = function(isCompare, __method) {
    $('#' + __method.dateRangeDiv).css('display', isCompare ? 'none' : '');
    $('#' + __method.dateRangeCompareDiv).css('display', isCompare ? '' : 'none');
    var pos = isCompare ? $('#' + this.inputCompareId).offset() : $('#' + this.inputId).offset();
    var offsetHeight = isCompare ? $('#' + this.inputCompareId).height() : $('#' + this.inputId).height();
    var clientWidth = parseInt($(document.body)[0].clientWidth);
    var left = pos.left;
    $("#" + this.calendarId).css('display', 'flex');
    $("#mask").click(function(){
        __method.close();
    });
    if (true == this.mOpts.singleCompare || true == this.mOpts.isSingleDay) {
        $('#' + this.endDateId).css('display', 'none');
        $('#' + this.endCompareDateId).css('display', 'none');
        $('#' + this.mOpts.joinLineId).css('display', 'none');
        $('.' + this.mOpts.joinLineId).css('display', 'none');
    }
    if (0 < clientWidth && $("#" + this.calendarId).width() + pos.left > clientWidth) {
        left = pos.left + $('#' + this.inputId).width() - $("#" + this.calendarId).width() + ((/msie/i.test(navigator.userAgent) && !(/opera/i.test(navigator.userAgent))) ? 5 : 0);
        __method.mOpts.theme == 'ta' && (left += 50);
    }
    // $("#" + this.calendarId).css('left', left + 'px');
    // $("#" + this.calendarId).css('top', pos.top + (__method.mOpts.theme == 'ta' ? 35 : 22) + 'px');
    isCompare ? this.changeInput(this.startCompareDateId) : this.changeInput(this.startDateId);
    return false;
}
;
pickerDateRange.prototype.close = function(btnSubmit) {
    var __method = this;
    if (btnSubmit) {
        if (this.mOpts.shortOpr === true) {
            $('#' + this.inputId).val($('#' + this.startDateId).val());
            $('#' + this.inputCompareId).val($('#' + this.startCompareDateId).val());
        } else {
            $('#' + this.inputId).val($('#' + this.startDateId).val() + ('' == $('#' + this.endDateId).val() ? '' : this.mOpts.defaultText + $('#' + this.endDateId).val()));
        }
        var nDateTime = ((true == this.mOpts.isTodayValid && '' != this.mOpts.isTodayValid)) ? new Date().getTime() : new Date().getTime() - (1 * 24 * 60 * 60 * 1000);
        var bDateTime = this.str2date($('#' + this.startDateId).val()).getTime();
        var eDateTime = this.str2date($('#' + this.endDateId).val()).getTime();
        if (eDateTime < bDateTime) {
            var tmp = $('#' + this.startDateId).val();
            $('#' + this.startDateId).val($('#' + this.endDateId).val());
            $('#' + this.endDateId).val(tmp);
        }
        var _val = this.mOpts.shortOpr == true ? $('#' + this.startDateId).val() : ($('#' + this.startDateId).val() + ('' == $('#' + this.endDateId).val() ? '' : this.mOpts.defaultText + $('#' + this.endDateId).val()));
        var input = document.getElementById(this.inputId);
        if (input && input.tagName == 'INPUT') {
            $('#' + this.inputId).removeClass('page-item-field-placeholder');
            $('#' + this.inputId).val(_val);
            $('#' + this.inputCompareId).is(':visible') && $('#' + this.inputCompareId).val(_compareVal);
        } else {
            $('#' + this.inputId).addClass('page-item-field-placeholder');
            $('#' + this.inputCompareId).is(':visible') && $('#' + this.inputCompareId).html(_compareVal);
        }
        if (this.mOpts.theme != 'ta') {
            if ('' != $('#' + this.startCompareDateId).val() && '' != $('#' + this.endCompareDateId).val()) {
                var bcDateTime = this.str2date($('#' + this.startCompareDateId).val()).getTime();
                var ecDateTime = this.str2date($('#' + this.endCompareDateId).val()).getTime();
                var _ecDateTime = bcDateTime + eDateTime - bDateTime;
                if (_ecDateTime > nDateTime) {
                    _ecDateTime = nDateTime;
                    $('#' + this.startCompareDateId).val(this.formatDate(this.date2ymd(new Date(_ecDateTime + bDateTime - eDateTime)).join('-')));
                }
                $('#' + this.endCompareDateId).val(this.formatDate(this.date2ymd(new Date(_ecDateTime)).join('-')));
                var bcDateTime = this.str2date($('#' + this.startCompareDateId).val()).getTime();
                var ecDateTime = this.str2date($('#' + this.endCompareDateId).val()).getTime();
                if (ecDateTime < bcDateTime) {
                    var tmp = $('#' + this.startCompareDateId).val();
                    $('#' + this.startCompareDateId).val($('#' + this.endCompareDateId).val());
                    $('#' + this.endCompareDateId).val(tmp);
                }
            }
        }
        var _compareVal = this.mOpts.shortOpr == true ? $('#' + this.startCompareDateId).val() : ($('#' + this.startCompareDateId).val() + ('' == $('#' + this.endCompareDateId).val() ? '' : this.mOpts.defaultText + $('#' + this.endCompareDateId).val()));
        if (input && input.tagName == 'INPUT') {
            $('#' + this.inputCompareId).val(_compareVal);
        } else {
            $('#' + this.inputCompareId).html(_compareVal);
        }
        var step = (bDateTime - eDateTime) / 86400000;
        $('#' + this.mOpts.startDateId).val($('#' + this.startDateId).val());
        $('#' + this.mOpts.endDateId).val($('#' + this.endDateId).val());
        $('#' + this.mOpts.startCompareDateId).val($('#' + this.startCompareDateId).val());
        $('#' + this.mOpts.endCompareDateId).val($('#' + this.endCompareDateId).val());
        for (var property in this.periodObj) {
            if ($('#' + this.mOpts[property])) {
                $('#' + this.mOpts[property]).parent().removeClass('a');
            }
        }
    }
    $("#" + __method.calendarId).css('display', 'none');
    return false;
}
;
pickerDateRange.prototype.fillDate = function(year, month, index) {
    var __method = this;
    var isTaTheme = this.mOpts.theme == 'ta';
    var firstDayOfMonth = new Date(year,month,1);
    var dateBegin = new Date(year,month,1);
    var w = dateBegin.getDay();
    dateBegin.setDate(1 - w);
    var lastDayOfMonth = new Date(year,month + 1,0);
    var dateEnd = new Date(year,month + 1,0);
    w = dateEnd.getDay();
    dateEnd.setDate(dateEnd.getDate() + 6 - w);
    var today = new Date(new Date() - 24 * 60 * 60 * 1000)
    var dToday = today.getDate();
    var mToday = today.getMonth();
    var yToday = today.getFullYear();
    var table = document.createElement('table');
    if (isTaTheme) {
        table.className = this.mOpts.dateTable;
        cap = document.createElement('caption');
        if (this.mOpts.magicSelect) {
            var yh = ['<div class="select_wrap" id="yselected_' + index + '"><div class="select" id="_ybtn_' + index + '">' + year + '</div><div class="dropdown" id="_yctn_' + index + '"><ul class="list_menu">']
            var mh = ['<div class="select_wrap" id="mselected_' + index + '"><div class="select" id="_mbtn_' + index + '">' + (month + 1) + '</div><div class="dropdown" id="_mctn_' + index + '"><ul class="list_menu">']
            i = 1;
            yt = yToday;
            do {
                yh.push('<li><a href="javascript:;">' + (yt--) + '</a></li>');
                mh.push('<li><a href="javascript:;">' + (i++) + '</a></li>');
            } while (i <= 12);yh.push('</ul></div></div>');
            mh.push('</ul></div></div>');
            $(cap).append(yh.join('') + '<span class="joinLine"> 年 </span>' + mh.join('') + '<span class="joinLine"> 月 </span>');
        } else {
            $(cap).append(year + '年' + (month + 1) + '月');
        }
        $(table).append(cap);
        thead = document.createElement('thead');
        tr = document.createElement('tr');
        var days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        for (var i = 0; i < 7; i++) {
            th = document.createElement('th');
            $(th).append(days[i]);
            $(tr).append(th);
        }
        $(thead).append(tr);
        $(table).append(thead);
        tr = document.createElement('tr');
        td = document.createElement('td');
        if (!this.mOpts.magicSelect) {
            if (0 == index) {
                $(td).append('<a href="javascript:void(0);" id="' + this.nextMonth + '"><i class="i_next"></i></a>');
            }
            if (index + 1 == this.mOpts.calendars) {
                $(td).append('<a href="javascript:void(0);" id="' + this.preMonth + '"><i class="i_pre"></i></a>');
            }
        }
        $(td).attr('colSpan', 7);
        $(td).css('text-align', 'center');
        $(tr).append(td);
        $(table).append(tr);
    } else {
        table.className = this.mOpts.theme + '_' + this.mOpts.dateTable;
        tr = document.createElement('tr');
        td = document.createElement('td');
        if (0 == index) {
            $(td).append('<a href="javascript:void(0);" id="' + this.nextMonth + '" class="gri_dateRangeNextMonth"><span>next</span></a>');
        }
        if (index + 1 == this.mOpts.calendars) {
            $(td).append('<a href="javascript:void(0);" id="' + this.preMonth + '" class="gri_dateRangePreMonth"><span>pre</span></a>');
        }
        $(td).append(year + '年' + (month + 1) + '月');
        $(td).attr('colSpan', 7);
        $(td).css('text-align', 'center');
        $(td).css('background-color', '#F9F9F9');
        $(tr).append(td);
        $(table).append(tr);
        var days = ['日', '一', '二', '三', '四', '五', '六'];
        tr = document.createElement('tr');
        for (var i = 0; i < 7; i++) {
            td = document.createElement('td');
            $(td).append(days[i]);
            $(tr).append(td);
        }
        $(table).append(tr);
    }
    var tdClass = ''
      , deviation = 0
      , ymd = '';
    for (var d = dateBegin; d.getTime() <= dateEnd.getTime(); d.setDate(d.getDate() + 1)) {
        if (d.getTime() < firstDayOfMonth.getTime()) {
            tdClass = this.mOpts.theme + '_' + this.mOpts.disableGray;
            deviation = '-1';
        } else if (d.getTime() > lastDayOfMonth.getTime()) {
            tdClass = this.mOpts.theme + '_' + this.mOpts.disableGray;
            deviation = '1';
        } else if ((this.mOpts.stopToday == true && d.getTime() < today.getTime()) || d.getTime() < __method.mOpts.minValidDate * 1000 || ('' !== __method.mOpts.maxValidDate && d.getTime() > __method.mOpts.maxValidDate * 1000)) {
            tdClass = this.mOpts.theme + '_' + this.mOpts.disableGray;
            deviation = '2';
        } else {
            deviation = '0';
            if (d.getDate() == dToday && d.getMonth() == mToday && d.getFullYear() == yToday) {
                if (true == this.mOpts.isTodayValid) {
                    tdClass = this.mOpts.theme + '_' + this.mOpts.isToday;
                } else {
                    tdClass = this.mOpts.theme + '_' + this.mOpts.disableGray;
                    deviation = '2';
                }
            } else {
                tdClass = '';
            }
            if (this.mOpts.weekendDis && (d.getDay() == 6 || d.getDay() == 0)) {
                tdClass = this.mOpts.theme + '_' + this.mOpts.disableGray;
                deviation = '3';
            }
            if (this.mOpts.disCertainDay && this.mOpts.disCertainDay.length > 0) {
                for (var p in this.mOpts.disCertainDay) {
                    if (!isNaN(this.mOpts.disCertainDay[p]) && d.getDay() === this.mOpts.disCertainDay[p]) {
                        tdClass = this.mOpts.theme + '_' + this.mOpts.disableGray;
                        deviation = '4';
                    }
                }
            }
            if (this.mOpts.disCertainDate && this.mOpts.disCertainDate.length > 0) {
                var isDisabled = false;
                for (var p in this.mOpts.disCertainDate) {
                    if (!isNaN(this.mOpts.disCertainDate[p]) || isNaN(parseInt(this.mOpts.disCertainDate[p]))) {
                        if (this.mOpts.disCertainDate[0] === true) {
                            isDisabled = !!(d.getDate() !== this.mOpts.disCertainDate[p]);
                            if (!isDisabled) {
                                break;
                            }
                        } else {
                            isDisabled = !!(d.getDate() === this.mOpts.disCertainDate[p]);
                            if (isDisabled) {
                                break;
                            }
                        }
                    }
                }
                if (isDisabled) {
                    tdClass = this.mOpts.theme + '_' + this.mOpts.disableGray;
                    deviation = '4';
                }
            }
        }
        if (0 == d.getDay()) {
            tr = document.createElement('tr');
        }
        td = document.createElement('td');
        td.innerHTML = d.getDate();
        if ('' != tdClass) {
            $(td).attr('class', tdClass);
        }
        if (0 == deviation) {
            ymd = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
            $(td).attr('id', __method.calendarId + '_' + ymd);
            $(td).css('cursor', 'pointer');
            (function(ymd) {
                $(td).bind("click", ymd, function() {
                    __method.selectDate(ymd);
                    return false;
                });
            }
            )(ymd);
        }
        $(tr).append(td);
        if (6 == d.getDay()) {
            $(table).append(tr);
        }
    }
    return table;
}
;
pickerDateRange.prototype.str2date = function(str) {
    var ar = str.split('-');
    return new Date(ar[0],ar[1] - 1,ar[2]);
}
;
pickerDateRange.prototype.compareStrDate = function(b, e) {
    var bDate = this.str2date(b);
    var eDate = this.str2date(e);
    if (bDate.getTime() > eDate.getTime()) {
        return 1;
    } else if (bDate.getTime() == eDate.getTime()) {
        return 0;
    } else {
        return -1;
    }
}
;
pickerDateRange.prototype.date2ymd = function(d) {
    return [d.getFullYear(), (d.getMonth() + 1), d.getDate()];
}
;
pickerDateRange.prototype.changeInput = function(ipt) {
    if (true == this.mOpts.isSingleDay) {
        ipt = this.startDateId;
    }
    var allInputs = [this.startDateId, this.startCompareDateId, this.endDateId, this.endCompareDateId];
    var cla = '';
    if (ipt == this.startDateId || ipt == this.endDateId) {
        cla = this.mOpts.theme + '_' + this.mOpts.selectCss;
    } else {
        cla = this.mOpts.theme + '_' + this.mOpts.compareCss;
    }
    if (ipt == this.endDateId && this.mOpts.singleCompare) {
        cla = this.mOpts.theme + '_' + this.mOpts.compareCss;
    }
    for (var i in allInputs) {
        $('#' + allInputs[i]).removeClass(this.mOpts.theme + '_' + this.mOpts.selectCss);
        $('#' + allInputs[i]).removeClass(this.mOpts.theme + '_' + this.mOpts.compareCss);
    }
    $('#' + ipt).addClass(cla);
    $('#' + ipt).css('background-repeat', 'repeat');
    this.dateInput = ipt;
}
;
pickerDateRange.prototype.formatDate = function(ymd) {
    return ymd.replace(/(\d{4})\-(\d{1,2})\-(\d{1,2})/g, function(ymdFormatDate, y, m, d) {
        if (m < 10) {
            m = '0' + m;
        }
        if (d < 10) {
            d = '0' + d;
        }
        return y + '-' + m + '-' + d;
    });
}
;
