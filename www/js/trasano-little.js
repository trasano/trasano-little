/*************************************************************************************************************
*
* Project: Trasano
* author: @rvallinot 
*
**************************************************************************************************************/

/*************************************************************************************************************
* SERVICE_TIME functions
**************************************************************************************************************/
/* 
 * Expects: void
 * Returns: Last claim time from local storage ordered by the patient
 */
function getLasClaimTime () {
    var lastClaimTime = new Date();
    lastClaimTime.setTime(parseInt(localStorage.getItem("lastClaimInMillis")));
    return lastClaimTime; 
}
/*************************************************************************************************************
* PATIENT functions
**************************************************************************************************************/
/* 
 * Expects: void
 * Returns: Patient DNI, name, surname and home by local storage
 */
function showPatientLittle() {
    $("#dniJumbotron").append(
        "<h1 class='text-justify'>"+ localStorage.getItem("dni") + getDNILetterByParameter(localStorage.getItem("dni")) + "</h1>" +   
        "<p class='text-justify'> " + localStorage.getItem("patientHome") + "</p>");
}
/*************************************************************************************************************
* MODAL functions
**************************************************************************************************************/
/* 
 * Expects: void
 * Returns: Close trasano modal and reload index.html
 */
function closeTrasanoModalLittle() {
    $('#trasanoMODAL').modal('hide');
    window.location = "../index.html";
}
/* 
 * Expects: void
 * Returns: Close trasano user modal and load index.html
 */
function closeTrasanoModalIndex() {
    $('#trasanoUserMODAL').modal('hide');
    window.location = "index.html";
}
/* 
 * Expects: void
 * Returns: Show ambulance claim alert. If the last claim was less than 1 hour ago, the patient can not claim. 
 */
function showClaimMODALLittle() {
    $("#trasanoModalHeader").empty();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();

    $("#trasanoModalHeader").append("<h4>Reclamar Ambulancia</h4>");


    $("#trasanoModalBody").append(
        "<p><strong>¿Desea reclamar la ambulancia?</strong></p>" + 
        "<p><div class='alert alert-warning' role='alert'>" + 
            "<span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span> " + 
            "Hora de petición del servicio: <strong>" + getServiceTime().toLocaleTimeString() + 
            " ("+ getServiceTime().toLocaleDateString() + 
            ")</strong></div>" + 
        "</p>"); 

    if (localStorage.getItem("lastClaimInMillis") != "0") {
        $("#trasanoModalBody").append(
            "<p><div class='alert alert-info' role='alert'>" + 
                "<span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span> " + 
                "Hora de petición del servicio: <strong>" + getLasClaimTime().toLocaleTimeString() + 
                " ("+ getLasClaimTime().toLocaleDateString() + 
                ")</strong></div>" + 
            "</p>");
    }

    $("#trasanoModalFooter").append(
        "<button type='button' class='btn btn-default' data-dismiss='modal'>NO</button>" +                   
        "<a class='btn btn btn-primary' href='javascript:showClaimALERTLittle();' role='button'>SI</a>");


    $('#trasanoMODAL').modal('show');
}
/* 
 * Expects: void
 * Returns: Show ambulance claim alert 
 */
function showCancelMODALLittle() {
    $("#trasanoModalHeader").empty();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();

    $("#trasanoModalHeader").append("<h4>Cancelar Ambulancia</h4>");

    $("#trasanoModalBody").append(
        "<p><strong>¿Desea cancelar la ambulancia?</strong></p>" + 
        "<div class='alert alert-danger' role='alert'>" + 
                "<span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span> " + 
                "Reclamación del servicio: <strong>" + getServiceTime().toLocaleTimeString() + 
                " ("+ getServiceTime().toLocaleDateString() + 
        ")</strong></div>");

    $("#trasanoModalFooter").append(
        "<button type='button' class='btn btn-default' data-dismiss='modal'>NO</button>" +                   
        "<a class='btn btn btn-primary' href='javascript:showCancelDefinedReasonALERTLittle();' role='button'>SI</a>");  
    $('#trasanoMODAL').modal('show');
}
/* 
 * Expects: void
 * Returns: Show pre-defined reason for cancel option and textarea if proceed
 */
function showCancelDefinedReasonALERTLittle() {
    $("#probar").remove();
    $("#trasanoModalBody").append(
        "<div class='form-group'>" + 
            "<label for='message-text' class='control-label'>Seleccione un motivo:</label>" + 
            "<select class='form-control' id='codeReason'>" + 
                "<option value='5' selected>Vuelta en coche con un familiar</option>" +
                "<option value='6'>Vuelta en coche con un conocido</option>" +
                "<option value='7'>Vuelta en TAXI</option>" + 
                "<option value='8'>Vuelta en transporte público</option>" +
                "<option value='9'>Otros motivos</option>" +
            "</select>" +
        '</div>');
    $("#trasanoModalFooter").empty();
    $("#trasanoModalFooter").append(
        "<button type='button' class='btn btn-default' data-dismiss='modal'>NO</button>" +                   
        "<a class='btn btn btn-primary' href='javascript:showCancelALERTLittle();' role='button'>SI</a>");
    
    // Check if option value is 9 => The user can write the reason for canceling
    $('#codeReason').on('change', function() {
        var value = $(this).val();
        if (value == 9) {
            $("#trasanoModalBody").append(
            "<div class='form-group' id='cancelReasonText'>" + 
                "<label for='message-text' class='control-label'>Describa el motivo:</label>" + 
                "<textarea class='form-control' id='cancelReason' maxlength='100' placeholder='Máximo 100 caracteres...'></textarea>" + 
            "</div>");
        } else {
            $("#cancelReasonText").remove();
        }
    });
}
/* 
 * Expects: void
 * Returns: Show alert before cancel an ambulance
 */
function showCancelALERTLittle() {
    localStorage.setItem("cancelReason", $("#cancelReason").val());
    localStorage.setItem("codeReason", $("#codeReason").val());
    
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();
    $("#probar").remove();

    $("#trasanoModalBody").append(
        "<div class='progress' id='probar'>" +
            "<div class='progress-bar progress-bar-striped active' " + 
                "role='progressbar' aria-valuenow='45' aria-valuemin='0' aria-valuemax='100' style='width: 0%'>" +
                    "<span class='sr-only'></span>" + 
                "</div>" +
            "</div>");

    $("#trasanoModalFooter").append(
        "<button type='button' class='btn btn-danger pull-right' data-dismiss='modal'>CANCELAR</button>");
    
    $(".progress-bar").animate({
        width: "100%"
    }, 1500);
    
    setTimeout(cancelAmbulanceLittle, 2000);
}
/* 
 * Expects: void
 * Returns: Show alert before claim an ambulance
 */
function showClaimALERTLittle() {
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();
    $("#probar").remove();

    $("#trasanoModalBody").append(
        "<div class='progress' id='probar'>" +
            "<div class='progress-bar progress-bar-striped active' " + 
                "role='progressbar' aria-valuenow='45' aria-valuemin='0' aria-valuemax='100' style='width: 0%'>" +
                    "<span class='sr-only'></span>" + 
                "</div>" +
            "</div>");

    $("#trasanoModalFooter").append(
        "<button type='button' class='btn btn-danger pull-right' data-dismiss='modal'>CANCELAR</button>");  

    $(".progress-bar").animate({
        width: "100%"
    }, 1500); 

    setTimeout(claimAmbulanceLittle, 2000);
}
/* 
 * Expects: void
 * Returns: Show alert modal before close an ambulance with trasano little
 */
function showCloseMODALLittle() {
    $('#trasanoMODAL').modal('show');
    
    /***********************************
    * PRODUCTION - LITTLE - [TAGCODE]
    ************************************/
    closeAmbulanceLittle(littleOptions.tagCode);
}
/*************************************************************************************************************
* TRASANO-WS CALLS for TRASANO-LITTLE
**************************************************************************************************************/
/* 
 * Expects: DNI/NIE
 * Returns: Patient's home and ambulance information given by the Web Service
 */
function requestServiceLittle() {
    var dni = $("#dniNumber").val() + getDNILetter();

    $("#trasanoModalHeader").empty();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();

    $("#trasanoModalHeader").append("<h4>Comprobando servicio...</h4>");
 
    if ($.isNumeric($("#dniNumber").val())) {
        $.ajax({
            type: "post",
            dataType: "json",
            contenType: "charset=utf-8",
            data: {dni: dni},
            url: "http://trasano.org:8080/patient/info",
            error: function (jqXHR, textStatus, errorThrown){
                console.log("Little-requestServiceLittle.Error: " + textStatus +  ", throws: " + errorThrown);

                $("#trasanoModalBody").append("<div class='alert alert-danger' role='alert'>" + 
                "<span class='glyphicon glyphicon-alert' aria-hidden='true'></span> " + 
                "<strong>Error!</strong> Error al enviar la petición.</div>");

                $("#trasanoModalFooter").append(
                    "<a class='btn btn-primary pull-right' href='javascript:closeTrasanoModalIndex();' role='button'>CERRAR</a>");

                $('#trasanoMODAL').modal('show'); 
            },
            success: function(data) {
                if (data.error.length === 0) {
                    console.log("LITTLE-LOGIN of patient: " + dni);            
                    localStorage.setItem("dni", $("#dniNumber").val());
                    localStorage.setItem("patientHome", data.patientHome);
                    localStorage.setItem("lastClaimInMillis", data.lastClaimInMillis);
                    var ambulance = {
                        "ambulanceCompany" : data.companyAmbulance, 
                        "numAmbulance": data.numAmbulance,
                        "driverName": data.name,
                        "driverSurname": data.surname,
                        "timeService": data.serviceTime,
                        "numClaim": data.numClaim
                    };
                localStorage.setItem("ambulance", JSON.stringify(ambulance));
                    window.location = "pages/little.html";
                } else {
                    $("#trasanoModalBody").append("<div class='alert alert-danger' role='alert'>" + 
                        "<span class='glyphicon glyphicon-alert' aria-hidden='true'></span> " + 
                        "<strong>Error!</strong> " + data.error + ".</div>");

                    $("#trasanoModalFooter").append(
                        "<a class='btn btn-primary pull-right' href='javascript:closeTrasanoModalIndex();' role='button'>CERRAR</a>");

                    $('#trasanoMODAL').modal('show'); 
                }
            }
        });
    } else {
        var messageAlert = "";
        if (!$.isNumeric($("#dniNumber").val())) {
            messageAlert = "Número de DNI/NIE incorrecto."
        }
        $("#trasanoModalBody").append("<div class='alert alert-danger' role='alert'>" + 
            "<span class='glyphicon glyphicon-alert' aria-hidden='true'></span> " + 
            "<strong>Error!</strong> " + messageAlert + "</div>");

        $("#trasanoModalFooter").append(
            "<a class='btn btn-primary pull-right' href='javascript:closeTrasanoModalIndex();' role='button'>CERRAR</a>");


        $('#trasanoMODAL').modal('show'); 
    }                         
}
/* 
 * Expects: void
 * Returns: Call TraSANO-WebService. Petition INFO for Litlle version
 * WS_Data_INPUT = {dni} 
 * WS_Data_OUTPUT = {companyAmbulance, numAmbulance, name, surname, serviceTime}
 */
function infoAmbulanceLittle() {
    console.log("Little-trasano.infoAmbulance()");
    var dni = localStorage.getItem("dni") + getDNILetterByParameter(localStorage.getItem("dni"));
    var ambulance = JSON.parse('[' + localStorage.getItem("ambulance") + ']');  
    localStorage.setItem("serviceTime", ambulance[0].timeService);    
}
/* 
 * Expects: void
 * Returns: Call TraSANO-WebService. Petition CLAIM
 * WS_Data_INPUT = {dni, reason} 
 * WS_Data_OUTPUT = {numClaim}
 */
function claimAmbulanceLittle() {
    console.log("trasano.claimAmbulanceLittle()");
    $("#probar").remove();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();
    var dni = localStorage.getItem("dni") + getDNILetterByParameter(localStorage.getItem("dni"));
    $.ajax({
        type: "post",
        dataType: "json",
        contenType: "charset=utf-8",
        data: {dni: dni},
        url: "http://trasano.org:8080/patient/claim",
        error: function (jqXHR, textStatus, errorThrown){
            console.log("Claim.Error: " + textStatus +  ", throws: " + errorThrown);
            showErrorModal("<h4>Solicitando ambulancia...</h4>", "Error al enviar la petición");  
        },
       success: function(data) {
            if (data.error.length === 0) {
                console.log("CLAIM ambulance by patient: " + dni);
                
                var lastClaim = new Date();
                localStorage.setItem("lastClaim", lastClaim.getTime());

                $("#trasanoModalBody").append(
                    "<div class='alert alert-success' role='alert'>" + 
                        "<p><span class='glyphicon glyphicon-ok' aria-hidden='true'></span> " + 
                        "<strong>La ambulancia ha sido reclamada!</strong></p> " +
                        "<p><span class='glyphicon glyphicon-ok' aria-hidden='true'></span> Hora de reclamación: <strong>" + 
                        lastClaim.toLocaleTimeString() + "</strong>.</p>" + 
                    "</div>");

                $("#trasanoModalFooter").append(
                    "<a class='btn btn-primary pull-right' href='javascript:closeTrasanoModalLittle();' role='button'>CERRAR</a>");  

            } else {
                showErrorModal("<h4>Solicitando ambulancia...</h4>", data.error); 
            }
        }
    });
}
/* 
 * Expects: void
 * Returns: Call TraSANO-WebService. Petition CANCEL. Delete ambulance service from local storage
 * WS_Data_INPUT = {dni, reason} 
 * WS_Data_OUTPUT = {}
 */
function cancelAmbulanceLittle() {
    console.log("trasano.cancelAmbulanceLittle()");

    $("#probar").remove();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();

    var dni = localStorage.getItem("dni") + getDNILetterByParameter(localStorage.getItem("dni"));
    var reason = localStorage.getItem("cancelReason");
    var code = localStorage.getItem("codeReason");
    
    localStorage.removeItem("cancelReason");
    localStorage.removeItem("codeReason");

    $.ajax({
        type: "post",
        dataType: "json",
        contenType: "charset=utf-8",
        data: {dni: dni, code: code, reason: reason},
        url: "http://trasano.org:8080/patient/cancel",
        error: function (jqXHR, textStatus, errorThrown){
            console.log("Cancel.Error: " + textStatus +  ", throws: " + errorThrown);
            $('#probarCancelALERT').modal('hide');
            showErrorModal("<h4>Solicitando ambulancia...</h4>", "Error al enviar la petición"); 
        },
        success: function(data) {
            if (data.error.length === 0) {
                console.log("CANCEL ambulance by patient: " + dni);
                
                localStorage.removeItem("ambulance");
                localStorage.removeItem("tagcode");
                localStorage.removeItem("serviceTime");
                localStorage.removeItem("lastClaim");

                var serviceTime = new Date();

                $("#trasanoModalBody").append(
                    "<div class='alert alert-success' role='alert'>" + 
                        "<p><span class='glyphicon glyphicon-ok' aria-hidden='true'></span> " + 
                            "<strong>La ambulancia ha sido cancelada!</strong></p>" + 
                        "<p><span class='glyphicon glyphicon-ok' aria-hidden='true'></span> " + 
                            "Hora de cancelación: <strong>" + serviceTime.toLocaleTimeString() + "</strong>.</p>" +
                    "</div>");

                $("#trasanoModalFooter").append(
                    "<a class='btn btn-primary pull-right' href='javascript:closeTrasanoModalLittle();' role='button'>CERRAR</a>"); 
            } else {
                showErrorModal("<h4>Solicitando ambulancia...</h4>", data.error); 
            }
        }
    });
}
/* 
 * Expects: tag code by config file
 * Returns: Call TraSANO-WebService. Petition CLOSE
 * WS_Data_INPUT = {dni} 
 * WS_Data_OUTPUT = {companyAmbulance, numAmbulance, name, surname, serviceTime}
 */
function closeAmbulanceLittle(tagCode) {
    console.log("trasano.closeAmbulanceLittle()");

    $("#trasanoModalHeader").empty();
    $("#trasanoModalBody").empty();
    $("#probar").remove();
    $("#trasanoModalHeader").append("<h4>Solicitando ambulancia...</h4>");
    $("#trasanoModalBody").append(
        "<div class='progress' id='probar'>" +
            "<div class='progress-bar progress-bar-striped active' " + 
                "role='progressbar' aria-valuenow='45' aria-valuemin='0' aria-valuemax='100' style='width: 0%'>" +
                    "<span class='sr-only'></span>" + 
                "</div>" +
            "</div>");
    
    $(".progress-bar").animate({
        width: "100%"
    }, 1500);

    var dni = localStorage.getItem("dni") + getDNILetterByParameter(localStorage.getItem("dni"));
    var serviceTime = new Date();

    window.setTimeout(function () {
        // ----------------------------------------------------------------------
        // Call TraSANO-WebService. Petition = {"CLOSE", time, DNI, tagLocation}                
        // ----------------------------------------------------------------------
        $.ajax({
            type: "post",
            dataType: "json",
            contenType: "charset=utf-8",
            data: {dni: dni, tagcode: tagCode},
            url: "http://trasano.org:8080/patient/close",
            error: function (jqXHR, textStatus, errorThrown){
                console.log("Close.Error: " + textStatus +  ", throws: " + errorThrown);
                $("#probar").remove();
                showErrorModal("<h4>Solicitando ambulancia...</h4>", "Error al enviar la petición");                                   
            },
            success: function(data) {
                if (data.error.length === 0) {
                    console.log("CLOSE ambulance by patient: " + dni);
                    
                    localStorage.setItem("tagcode", tagCode);
                    localStorage.setItem("serviceTime", serviceTime.getTime());
                    localStorage.setItem("lastClaim", serviceTime.getTime());

                    var ambulance = {
                        "ambulanceCompany" : data.companyAmbulance, 
                        "numAmbulance": data.numAmbulance,
                        "driverName": data.name,
                        "driverSurname": data.surname,
                        "timeService": data.serviceTime,
                        "numClaim": data.numClaim
                    };
                    localStorage.setItem("ambulance", JSON.stringify(ambulance));

                    $("#probar").remove();
                    $("#trasanoModalBody").empty();  
                    $("#trasanoModalBody").append("<div class='alert alert-success' role='alert'>" + 
                        "<p><span class='glyphicon glyphicon-ok' aria-hidden='true'></span> <strong>La ambulancia ha sido solicitada!</strong></p>" + 
                        "<p><span class='glyphicon glyphicon-ok' aria-hidden='true'></span> Hora de solicitud: <strong>" 
                            + serviceTime.toLocaleTimeString() + " (" + serviceTime.toLocaleDateString() + ")</strong></p></div>");
                    $("#trasanoModalFooter").empty(); 
                    $("#trasanoModalFooter").append(
                        "<a class='btn btn-primary pull-right' href='javascript:closeTrasanoModalLittle();' role='button'>CERRAR</a>");
                } else {
                    $("#probar").remove();
                    showErrorModal("<h4>Solicitando ambulancia...</h4>", data.error);
                }
            }
        });
    }, 
    2000); 
}