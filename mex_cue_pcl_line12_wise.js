var fs = require('fs');
var modbus = require('jsmodbus');
var PubNub = require('pubnub');
try{
var secPubNub=0;
var BottlerSorterct = null,
    BottlerSorterresults = null,
    CntInBottlerSorter = null,
    CntOutBottlerSorter = null,
    BottlerSorteractual = 0,
    BottlerSortertime = 0,
    BottlerSortersec = 0,
    BottlerSorterflagStopped = false,
    BottlerSorterstate = 0,
    BottlerSorterspeed = 0,
    BottlerSorterspeedTemp = 0,
    BottlerSorterflagPrint = 0,
    BottlerSortersecStop = 0,
    BottlerSorterdeltaRejected = null,
    BottlerSorterONS = false,
    BottlerSortertimeStop = 60, //NOTE: Timestop
    BottlerSorterWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    BottlerSorterflagRunning = false;
var FillerCapperct = null,
    FillerCapperresults = null,
    CntInFillerCapper = null,
    CntOutFillerCapper = null,
    FillerCapperactual = 0,
    FillerCappertime = 0,
    FillerCappersec = 0,
    FillerCapperflagStopped = false,
    FillerCapperstate = 0,
    FillerCapperspeed = 0,
    FillerCapperspeedTemp = 0,
    FillerCapperflagPrint = 0,
    FillerCappersecStop = 0,
    FillerCapperdeltaRejected = null,
    FillerCapperONS = false,
    FillerCappertimeStop = 60, //NOTE: Timestop
    FillerCapperWorktime = 0.95, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    FillerCapperflagRunning = false,
    FillerCapperRejectFlag = false,
    FillerCapperReject,
    FillerCapperVerify = (function(){
      try{
        FillerCapperReject = fs.readFileSync('FillerCapperRejected.json')
        if(FillerCapperReject.toString().indexOf('}') > 0 && FillerCapperReject.toString().indexOf('{\"rejected\":') != -1){
          FillerCapperReject = JSON.parse(FillerCapperReject)
        }else{
          throw 12121212
        }
      }catch(err){
        if(err.code == 'ENOENT' || err == 12121212){
          fs.writeFileSync('FillerCapperRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
          FillerCapperReject = {
            rejected : 0
          }
        }
      }
    })();
var CapSupplyct = null,
    CapSupplyresults = null,
    CntOutCapSupply = null,
    CapSupplyactual = 0,
    CapSupplytime = 0,
    CapSupplysec = 0,
    CapSupplyflagStopped = false,
    CapSupplystate = 0,
    CapSupplyspeed = 0,
    CapSupplyspeedTemp = 0,
    CapSupplyflagPrint = 0,
    CapSupplysecStop = 0,
    CapSupplydeltaRejected = null,
    CapSupplyONS = false,
    CapSupplytimeStop = 60, //NOTE: Timestop
    CapSupplyWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    CapSupplyflagRunning = false;
var Depuckerct = null,
    Depuckerresults = null,
    CntOutDepucker = null,
    Depuckeractual = 0,
    Depuckertime = 0,
    Depuckersec = 0,
    DepuckerflagStopped = false,
    Depuckerstate = 0,
    Depuckerspeed = 0,
    DepuckerspeedTemp = 0,
    DepuckerflagPrint = 0,
    DepuckersecStop = 0,
    DepuckerdeltaRejected = null,
    DepuckerONS = false,
    DepuckertimeStop = 60, //NOTE: Timestop
    DepuckerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    DepuckerflagRunning = false;
var Labelerct = null,
    Labelerresults = null,
    CntInLabeler = null,
    CntOutLabeler = null,
    Labeleractual = 0,
    Labelertime = 0,
    Labelersec = 0,
    LabelerflagStopped = false,
    Labelerstate = 0,
    Labelerspeed = 0,
    LabelerspeedTemp = 0,
    LabelerflagPrint = 0,
    LabelersecStop = 0,
    LabelerdeltaRejected = null,
    LabelerONS = false,
    LabelertimeStop = 60, //NOTE: Timestop
    LabelerWorktime = 0.95, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    LabelerflagRunning = false,
    LabelerRejectFlag = false,
    LabelerReject,
    LabelerVerify = (function(){
      try{
        LabelerReject = fs.readFileSync('LabelerRejected.json')
        if(LabelerReject.toString().indexOf('}') > 0 && LabelerReject.toString().indexOf('{\"rejected\":') != -1){
          LabelerReject = JSON.parse(LabelerReject)
        }else{
          throw 12121212
        }
      }catch(err){
        if(err.code == 'ENOENT' || err == 12121212){
          fs.writeFileSync('LabelerRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
          LabelerReject = {
            rejected : 0
          }
        }
      }
    })();
var CaseFormerct = null,
    CaseFormerresults = null,
    CntInCaseFormer = null,
    CntOutCaseFormer = null,
    CaseFormeractual = 0,
    CaseFormertime = 0,
    CaseFormersec = 0,
    CaseFormerflagStopped = false,
    CaseFormerstate = 0,
    CaseFormerspeed = 0,
    CaseFormerspeedTemp = 0,
    CaseFormerflagPrint = 0,
    CaseFormersecStop = 0,
    CaseFormerdeltaRejected = null,
    CaseFormerONS = false,
    CaseFormertimeStop = 60, //NOTE: Timestop
    CaseFormerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    CaseFormerflagRunning = false;
var CasePackerct = null,
    CasePackerresults = null,
    CntInCasePacker = null,
    CntOutCasePacker = null,
    CasePackeractual = 0,
    CasePackertime = 0,
    CasePackersec = 0,
    CasePackerflagStopped = false,
    CasePackerstate = 0,
    CasePackerspeed = 0,
    CasePackerspeedTemp = 0,
    CasePackerflagPrint = 0,
    CasePackersecStop = 0,
    CasePackerdeltaRejected = null,
    CasePackerONS = false,
    CasePackertimeStop = 60, //NOTE: Timestop
    CasePackerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    CasePackerflagRunning = false;
var CaseSealerct = null,
    CaseSealerresults = null,
    CntInCaseSealer = null,
    CntOutCaseSealer = null,
    CaseSealeractual = 0,
    CaseSealertime = 0,
    CaseSealersec = 0,
    CaseSealerflagStopped = false,
    CaseSealerstate = 0,
    CaseSealerspeed = 0,
    CaseSealerspeedTemp = 0,
    CaseSealerflagPrint = 0,
    CaseSealersecStop = 0,
    CaseSealerdeltaRejected = null,
    CaseSealerONS = false,
    CaseSealertimeStop = 60, //NOTE: Timestop
    CaseSealerWorktime = 0.95, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    CaseSealerflagRunning = false,
    CaseSealerRejectFlag = false,
    CaseSealerReject,
    CaseSealerVerify = (function(){
      try{
        CaseSealerReject = fs.readFileSync('CaseSealerRejected.json')
        if(CaseSealerReject.toString().indexOf('}') > 0 && CaseSealerReject.toString().indexOf('{\"rejected\":') != -1){
          CaseSealerReject = JSON.parse(CaseSealerReject)
        }else{
          throw 12121212
        }
      }catch(err){
        if(err.code == 'ENOENT' || err == 12121212){
          fs.writeFileSync('CaseSealerRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
          CaseSealerReject = {
            rejected : 0
          }
        }
      }
    })();
var CntOutEOL=null,
    secEOL=0;
var publishConfig;
var intId1,intId2;
var files = fs.readdirSync("C:/PULSE/L12_LOGS/"); //Leer documentos
var text2send=[];
var i=0;
var pubnub = new PubNub({
  publishKey:		"pub-c-8d024e5b-23bc-4ce8-ab68-b39b00347dfb",
subscribeKey: 		"sub-c-c3b3aa54-b44b-11e7-895e-c6a8ff6a3d85",
  uuid: "CUE_PCL_LINE12"
});


var senderData = function (){
  pubnub.publish(publishConfig, function(status, response) {
});}


var client1 = modbus.client.tcp.complete({
  'host': "192.168.10.102",
  'port': 502,
  'autoReconnect': true,
  'timeout': 60000,
  'logEnabled': true,
  'reconnectTimeout' : 30000
});
var client2 = modbus.client.tcp.complete({
  'host': "192.168.10.103",
  'port': 502,
  'autoReconnect': true,
  'timeout': 60000,
  'logEnabled': true,
  'reconnectTimeout' : 30000
});
}catch(err){
    fs.appendFileSync("error_declarations.log",err + '\n');
}
try{
  client1.connect();
  client2.connect();
}catch(err){
  fs.appendFileSync("error_connection.log",err + '\n');
}
try{
  /*----------------------------------------------------------------------------------Funcction-------------------------------------------------------------------------------------------*/

  var joinWord=function(num1, num2) {
    var bits = "00000000000000000000000000000000";
    var bin1 = num1.toString(2),
      bin2 = num2.toString(2),
      newNum = bits.split("");

    for (i = 0; i < bin1.length; i++) {
      newNum[31 - i] = bin1[(bin1.length - 1) - i];
    }
    for (i = 0; i < bin2.length; i++) {
      newNum[15 - i] = bin2[(bin2.length - 1) - i];
    }
    bits = newNum.join("");
    return parseInt(bits, 2);
  };
//PubNub --------------------------------------------------------------------------------------------------------------------
setInterval(function(){
        if(secPubNub>=60*5){

          var idle=function(){
            i=0;
            text2send=[];
            for (var k=0;k<files.length;k++){//Verificar los archivos
              var stats = fs.statSync("C:/PULSE/L12_LOGS/"+files[k]);
              var mtime = new Date(stats.mtime).getTime();
              if (mtime< (Date.now() - (15*60*1000))&&files[k].indexOf("serialbox")==-1){
                flagInfo2Send=1;
                text2send[i]=files[k];
                i++;
              }
            }
          };
          secPubNub=0;
          publishConfig = {
            channel : "Cue_PCL_Monitor",
            message : {
                  line: "12",
                  tt: Date.now(),
                  machines:text2send

                }
          };
          senderData();
        }
        secPubNub++;
    },1000);
//PubNub --------------------------------------------------------------------------------------------------------------------


client1.on('connect', function(err) {
  intId1 =
    setInterval(function(){
        client1.readHoldingRegisters(0, 16).then(function(resp) {
          CntInFillerCapper =         joinWord(resp.register[0], resp.register[1]);
          CntOutBottlerSorter =  joinWord(resp.register[2], resp.register[3]);
          CntOutCapSupply =     joinWord(resp.register[4], resp.register[5]);
          CntOutFillerCapper =        joinWord(resp.register[6], resp.register[7]);
          CntOutDepucker =      joinWord(resp.register[8], resp.register[9]);
        //------------------------------------------BottlerSorter----------------------------------------------
              BottlerSorterct = CntOutBottlerSorter // NOTE: igualar al contador de salida
              if (!BottlerSorterONS && BottlerSorterct) {
                BottlerSorterspeedTemp = BottlerSorterct
                BottlerSortersec = Date.now()
                BottlerSorterONS = true
                BottlerSortertime = Date.now()
              }
              if(BottlerSorterct > BottlerSorteractual){
                if(BottlerSorterflagStopped){
                  BottlerSorterspeed = BottlerSorterct - BottlerSorterspeedTemp
                  BottlerSorterspeedTemp = BottlerSorterct
                  BottlerSortersec = Date.now()
                  BottlerSorterdeltaRejected = null
                  BottlerSorterRejectFlag = false
                  BottlerSortertime = Date.now()
                }
                BottlerSortersecStop = 0
                BottlerSorterstate = 1
                BottlerSorterflagStopped = false
                BottlerSorterflagRunning = true
              } else if( BottlerSorterct == BottlerSorteractual ){
                if(BottlerSortersecStop == 0){
                  BottlerSortertime = Date.now()
                  BottlerSortersecStop = Date.now()
                }
                if( ( Date.now() - ( BottlerSortertimeStop * 1000 ) ) >= BottlerSortersecStop ){
                  BottlerSorterspeed = 0
                  BottlerSorterstate = 2
                  BottlerSorterspeedTemp = BottlerSorterct
                  BottlerSorterflagStopped = true
                  BottlerSorterflagRunning = false
                  BottlerSorterflagPrint = 1
                }
              }
              BottlerSorteractual = BottlerSorterct
              if(Date.now() - 60000 * BottlerSorterWorktime >= BottlerSortersec && BottlerSortersecStop == 0){
                if(BottlerSorterflagRunning && BottlerSorterct){
                  BottlerSorterflagPrint = 1
                  BottlerSortersecStop = 0
                  BottlerSorterspeed = BottlerSorterct - BottlerSorterspeedTemp
                  BottlerSorterspeedTemp = BottlerSorterct
                  BottlerSortersec = Date.now()
                }
              }
              BottlerSorterresults = {
                ST: BottlerSorterstate,
                CPQO : CntOutBottlerSorter,
                SP: BottlerSorterspeed
              }
              if (BottlerSorterflagPrint == 1) {
                for (var key in BottlerSorterresults) {
                  if( BottlerSorterresults[key] != null && ! isNaN(BottlerSorterresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L12_LOGS/mex_pcl__BottlerSorter_L12.log', 'tt=' + BottlerSortertime + ',var=' + key + ',val=' + BottlerSorterresults[key] + '\n')
                }
                BottlerSorterflagPrint = 0
                BottlerSortersecStop = 0
                BottlerSortertime = Date.now()
              }
        //------------------------------------------BottlerSorter----------------------------------------------
        //------------------------------------------FillerCapper----------------------------------------------
              FillerCapperct = CntOutFillerCapper // NOTE: igualar al contador de salida
              if (!FillerCapperONS && FillerCapperct) {
                FillerCapperspeedTemp = FillerCapperct
                FillerCappersec = Date.now()
                FillerCapperONS = true
                FillerCappertime = Date.now()
              }
              if(FillerCapperct > FillerCapperactual){
                if(FillerCapperflagStopped){
                  FillerCapperspeed = FillerCapperct - FillerCapperspeedTemp
                  FillerCapperspeedTemp = FillerCapperct
                  FillerCappersec = Date.now()
                  FillerCapperdeltaRejected = null
                  FillerCappertime = Date.now()
                  FillerCapperRejectFlag = false
                }
                FillerCappersecStop = 0
                FillerCapperstate = 1
                FillerCapperflagStopped = false
                FillerCapperflagRunning = true
              } else if( FillerCapperct == FillerCapperactual ){
                if(FillerCappersecStop == 0){
                  FillerCappertime = Date.now()
                  FillerCappersecStop = Date.now()
                }
                if( ( Date.now() - ( FillerCappertimeStop * 1000 ) ) >= FillerCappersecStop ){
                  FillerCapperspeed = 0
                  FillerCapperstate = 2
                  FillerCapperspeedTemp = FillerCapperct
                  FillerCapperflagStopped = true
                  FillerCapperflagRunning = false
                  if(CntInFillerCapper - CntOutFillerCapper - FillerCapperReject.rejected != 0 && ! FillerCapperRejectFlag){
                    FillerCapperdeltaRejected = CntInFillerCapper - CntOutFillerCapper - FillerCapperReject.rejected
                    FillerCapperReject.rejected = CntInFillerCapper - CntOutFillerCapper
                    fs.writeFileSync('FillerCapperRejected.json','{"rejected": ' + FillerCapperReject.rejected + '}')
                    FillerCapperRejectFlag = true
                  }else{
                    FillerCapperdeltaRejected = null
                  }
                  FillerCapperflagPrint = 1
                }
              }
              FillerCapperactual = FillerCapperct
              if(Date.now() - 60000 * FillerCapperWorktime >= FillerCappersec && FillerCappersecStop == 0){
                if(FillerCapperflagRunning && FillerCapperct){
                  FillerCapperflagPrint = 1
                  FillerCappersecStop = 0
                  FillerCapperspeed = FillerCapperct - FillerCapperspeedTemp
                  FillerCapperspeedTemp = FillerCapperct
                  FillerCappersec = Date.now()
                }
              }
              FillerCapperresults = {
                ST: FillerCapperstate,
                CPQI : CntInFillerCapper,
                CPQO : CntOutFillerCapper,
                CPQR : FillerCapperdeltaRejected,
                SP: FillerCapperspeed
              }
              if (FillerCapperflagPrint == 1) {
                for (var key in FillerCapperresults) {
                  if( FillerCapperresults[key] != null && ! isNaN(FillerCapperresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L12_LOGS/mex_pcl__FillerCapper_L12.log', 'tt=' + FillerCappertime + ',var=' + key + ',val=' + FillerCapperresults[key] + '\n')
                }
                FillerCapperflagPrint = 0
                FillerCappersecStop = 0
                FillerCappertime = Date.now()
              }
        //------------------------------------------FillerCapper----------------------------------------------
        //------------------------------------------CapSupply----------------------------------------------
              CapSupplyct = CntOutCapSupply // NOTE: igualar al contador de salida
              if (!CapSupplyONS && CapSupplyct) {
                CapSupplyspeedTemp = CapSupplyct
                CapSupplysec = Date.now()
                CapSupplyONS = true
                CapSupplytime = Date.now()
              }
              if(CapSupplyct > CapSupplyactual){
                if(CapSupplyflagStopped){
                  CapSupplyspeed = CapSupplyct - CapSupplyspeedTemp
                  CapSupplyspeedTemp = CapSupplyct
                  CapSupplysec = Date.now()
                  CapSupplydeltaRejected = null
                  CapSupplyRejectFlag = false
                  CapSupplytime = Date.now()
                }
                CapSupplysecStop = 0
                CapSupplystate = 1
                CapSupplyflagStopped = false
                CapSupplyflagRunning = true
              } else if( CapSupplyct == CapSupplyactual ){
                if(CapSupplysecStop == 0){
                  CapSupplytime = Date.now()
                  CapSupplysecStop = Date.now()
                }
                if( ( Date.now() - ( CapSupplytimeStop * 1000 ) ) >= CapSupplysecStop ){
                  CapSupplyspeed = 0
                  CapSupplystate = 2
                  CapSupplyspeedTemp = CapSupplyct
                  CapSupplyflagStopped = true
                  CapSupplyflagRunning = false
                  CapSupplyflagPrint = 1
                }
              }
              CapSupplyactual = CapSupplyct
              if(Date.now() - 60000 * CapSupplyWorktime >= CapSupplysec && CapSupplysecStop == 0){
                if(CapSupplyflagRunning && CapSupplyct){
                  CapSupplyflagPrint = 1
                  CapSupplysecStop = 0
                  CapSupplyspeed = CapSupplyct - CapSupplyspeedTemp
                  CapSupplyspeedTemp = CapSupplyct
                  CapSupplysec = Date.now()
                }
              }
              CapSupplyresults = {
                ST: CapSupplystate,
                CPQO : CntOutCapSupply,
                SP: CapSupplyspeed
              }
              if (CapSupplyflagPrint == 1) {
                for (var key in CapSupplyresults) {
                  if( CapSupplyresults[key] != null && ! isNaN(CapSupplyresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L12_LOGS/mex_pcl__CapSupply_L12.log', 'tt=' + CapSupplytime + ',var=' + key + ',val=' + CapSupplyresults[key] + '\n')
                }
                CapSupplyflagPrint = 0
                CapSupplysecStop = 0
                CapSupplytime = Date.now()
              }
        //------------------------------------------CapSupply----------------------------------------------
        //------------------------------------------Depucker----------------------------------------------
              Depuckerct = CntOutDepucker // NOTE: igualar al contador de salida
              if (!DepuckerONS && Depuckerct) {
                DepuckerspeedTemp = Depuckerct
                Depuckersec = Date.now()
                DepuckerONS = true
                Depuckertime = Date.now()
              }
              if(Depuckerct > Depuckeractual){
                if(DepuckerflagStopped){
                  Depuckerspeed = Depuckerct - DepuckerspeedTemp
                  DepuckerspeedTemp = Depuckerct
                  Depuckersec = Date.now()
                  DepuckerdeltaRejected = null
                  DepuckerRejectFlag = false
                  Depuckertime = Date.now()
                }
                DepuckersecStop = 0
                Depuckerstate = 1
                DepuckerflagStopped = false
                DepuckerflagRunning = true
              } else if( Depuckerct == Depuckeractual ){
                if(DepuckersecStop == 0){
                  Depuckertime = Date.now()
                  DepuckersecStop = Date.now()
                }
                if( ( Date.now() - ( DepuckertimeStop * 1000 ) ) >= DepuckersecStop ){
                  Depuckerspeed = 0
                  Depuckerstate = 2
                  DepuckerspeedTemp = Depuckerct
                  DepuckerflagStopped = true
                  DepuckerflagRunning = false
                  DepuckerflagPrint = 1
                }
              }
              Depuckeractual = Depuckerct
              if(Date.now() - 60000 * DepuckerWorktime >= Depuckersec && DepuckersecStop == 0){
                if(DepuckerflagRunning && Depuckerct){
                  DepuckerflagPrint = 1
                  DepuckersecStop = 0
                  Depuckerspeed = Depuckerct - DepuckerspeedTemp
                  DepuckerspeedTemp = Depuckerct
                  Depuckersec = Date.now()
                }
              }
              Depuckerresults = {
                ST: Depuckerstate,
                CPQO : CntOutDepucker,
                SP: Depuckerspeed
              }
              if (DepuckerflagPrint == 1) {
                for (var key in Depuckerresults) {
                  if( Depuckerresults[key] != null && ! isNaN(Depuckerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L12_LOGS/mex_PCL_Depucker_L12.log', 'tt=' + Depuckertime + ',var=' + key + ',val=' + Depuckerresults[key] + '\n')
                }
                DepuckerflagPrint = 0
                DepuckersecStop = 0
                Depuckertime = Date.now()
              }
        //------------------------------------------Depucker----------------------------------------------
        });//Cierre de lectura
      },1000);
  });//Cierre de cliente

  client1.on('error', function(err){
    clearInterval(intId1);
  });
  client1.on('close', function() {
  	clearInterval(intId1);
  });

client2.on('connect', function(err) {
          intId2 = setInterval(function(){
              client2.readHoldingRegisters(0, 16).then(function(resp) {
                CntOutLabeler    = joinWord(resp.register[0], resp.register[1]);
                CntInCasePacker   = joinWord(resp.register[2], resp.register[3]);
                CntOutCaseFormer  = joinWord(resp.register[4], resp.register[5]);
                CntInLabeler     = joinWord(resp.register[6], resp.register[7]);
                CntOutCaseSealer  = joinWord(resp.register[8], resp.register[9]);
                CntOutEOL         = joinWord(resp.register[8], resp.register[9]);
                CntOutCasePacker  = joinWord(resp.register[10], resp.register[11]);
                CntInCaseSealer   = CntOutCasePacker;

                //CntInCaseSealer   = joinWord(resp.register[10], resp.register[11]);
        //------------------------------------------Labeler----------------------------------------------
              Labelerct = CntOutLabeler // NOTE: igualar al contador de salida
              if (!LabelerONS && Labelerct) {
                LabelerspeedTemp = Labelerct
                Labelersec = Date.now()
                LabelerONS = true
                Labelertime = Date.now()
              }
              if(Labelerct > Labeleractual){
                if(LabelerflagStopped){
                  Labelerspeed = Labelerct - LabelerspeedTemp
                  LabelerspeedTemp = Labelerct
                  Labelersec = Date.now()
                  LabelerdeltaRejected = null
                  LabelerRejectFlag = false
                  Labelertime = Date.now()
                }
                LabelersecStop = 0
                Labelerstate = 1
                LabelerflagStopped = false
                LabelerflagRunning = true
              } else if( Labelerct == Labeleractual ){
                if(LabelersecStop == 0){
                  Labelertime = Date.now()
                  LabelersecStop = Date.now()
                }
                if( ( Date.now() - ( LabelertimeStop * 1000 ) ) >= LabelersecStop ){
                  Labelerspeed = 0
                  Labelerstate = 2
                  LabelerspeedTemp = Labelerct
                  LabelerflagStopped = true
                  LabelerflagRunning = false
                  if(CntInLabeler - CntOutLabeler - LabelerReject.rejected != 0 && ! LabelerRejectFlag){
                    LabelerdeltaRejected = CntInLabeler - CntOutLabeler - LabelerReject.rejected
                    LabelerReject.rejected = CntInLabeler - CntOutLabeler
                    fs.writeFileSync('LabelerRejected.json','{"rejected": ' + LabelerReject.rejected + '}')
                    LabelerRejectFlag = true
                  }else{
                    LabelerdeltaRejected = null
                  }
                  LabelerflagPrint = 1
                }
              }
              Labeleractual = Labelerct
              if(Date.now() - 60000 * LabelerWorktime >= Labelersec && LabelersecStop == 0){
                if(LabelerflagRunning && Labelerct){
                  LabelerflagPrint = 1
                  LabelersecStop = 0
                  Labelerspeed = Labelerct - LabelerspeedTemp
                  LabelerspeedTemp = Labelerct
                  Labelersec = Date.now()
                }
              }
              Labelerresults = {
                ST: Labelerstate,
                CPQI : CntInLabeler,
                CPQO : CntOutLabeler,
                CPQR : LabelerdeltaRejected,
                SP: Labelerspeed
              }
              if (LabelerflagPrint == 1) {
                for (var key in Labelerresults) {
                  if( Labelerresults[key] != null && ! isNaN(Labelerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L12_LOGS/mex_pcl__Labeler_L12.log', 'tt=' + Labelertime + ',var=' + key + ',val=' + Labelerresults[key] + '\n')
                }
                LabelerflagPrint = 0
                LabelersecStop = 0
                Labelertime = Date.now()
              }
        //------------------------------------------Labeler----------------------------------------------
        //------------------------------------------CaseFormer----------------------------------------------
              CaseFormerct = CntOutCaseFormer // NOTE: igualar al contador de salida
              if (!CaseFormerONS && CaseFormerct) {
                CaseFormerspeedTemp = CaseFormerct
                CaseFormersec = Date.now()
                CaseFormerONS = true
                CaseFormertime = Date.now()
              }
              if(CaseFormerct > CaseFormeractual){
                if(CaseFormerflagStopped){
                  CaseFormerspeed = CaseFormerct - CaseFormerspeedTemp
                  CaseFormerspeedTemp = CaseFormerct
                  CaseFormersec = Date.now()
                  CaseFormerdeltaRejected = null
                  CaseFormerRejectFlag = false
                  CaseFormertime = Date.now()
                }
                CaseFormersecStop = 0
                CaseFormerstate = 1
                CaseFormerflagStopped = false
                CaseFormerflagRunning = true
              } else if( CaseFormerct == CaseFormeractual ){
                if(CaseFormersecStop == 0){
                  CaseFormertime = Date.now()
                  CaseFormersecStop = Date.now()
                }
                if( ( Date.now() - ( CaseFormertimeStop * 1000 ) ) >= CaseFormersecStop ){
                  CaseFormerspeed = 0
                  CaseFormerstate = 2
                  CaseFormerspeedTemp = CaseFormerct
                  CaseFormerflagStopped = true
                  CaseFormerflagRunning = false
                  CaseFormerflagPrint = 1
                }
              }
              CaseFormeractual = CaseFormerct
              if(Date.now() - 60000 * CaseFormerWorktime >= CaseFormersec && CaseFormersecStop == 0){
                if(CaseFormerflagRunning && CaseFormerct){
                  CaseFormerflagPrint = 1
                  CaseFormersecStop = 0
                  CaseFormerspeed = CaseFormerct - CaseFormerspeedTemp
                  CaseFormerspeedTemp = CaseFormerct
                  CaseFormersec = Date.now()
                }
              }
              CaseFormerresults = {
                ST: CaseFormerstate,
                CPQO : CntOutCaseFormer,
                SP: CaseFormerspeed
              }
              if (CaseFormerflagPrint == 1) {
                for (var key in CaseFormerresults) {
                  if( CaseFormerresults[key] != null && ! isNaN(CaseFormerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L12_LOGS/mex_pcl__CaseFormer_L12.log', 'tt=' + CaseFormertime + ',var=' + key + ',val=' + CaseFormerresults[key] + '\n')
                }
                CaseFormerflagPrint = 0
                CaseFormersecStop = 0
                CaseFormertime = Date.now()
              }
        //------------------------------------------CaseFormer----------------------------------------------
        //------------------------------------------CasePacker----------------------------------------------
              CasePackerct = CntOutCasePacker // NOTE: igualar al contador de salida
              if (!CasePackerONS && CasePackerct) {
                CasePackerspeedTemp = CasePackerct
                CasePackersec = Date.now()
                CasePackerONS = true
                CasePackertime = Date.now()
              }
              if(CasePackerct > CasePackeractual){
                if(CasePackerflagStopped){
                  CasePackerspeed = CasePackerct - CasePackerspeedTemp
                  CasePackerspeedTemp = CasePackerct
                  CasePackersec = Date.now()
                  CasePackerdeltaRejected = null
                  CasePackerRejectFlag = false
                  CasePackertime = Date.now()
                }
                CasePackersecStop = 0
                CasePackerstate = 1
                CasePackerflagStopped = false
                CasePackerflagRunning = true
              } else if( CasePackerct == CasePackeractual ){
                if(CasePackersecStop == 0){
                  CasePackertime = Date.now()
                  CasePackersecStop = Date.now()
                }
                if( ( Date.now() - ( CasePackertimeStop * 1000 ) ) >= CasePackersecStop ){
                  CasePackerspeed = 0
                  CasePackerstate = 2
                  CasePackerspeedTemp = CasePackerct
                  CasePackerflagStopped = true
                  CasePackerflagRunning = false
                  CasePackerflagPrint = 1
                }
              }
              CasePackeractual = CasePackerct
              if(Date.now() - 60000 * CasePackerWorktime >= CasePackersec && CasePackersecStop == 0){
                if(CasePackerflagRunning && CasePackerct){
                  CasePackerflagPrint = 1
                  CasePackersecStop = 0
                  CasePackerspeed = CasePackerct - CasePackerspeedTemp
                  CasePackerspeedTemp = CasePackerct
                  CasePackersec = Date.now()
                }
              }
              CasePackerresults = {
                ST: CasePackerstate,
                CPQI : CntInCasePacker,
                CPQO : CntOutCasePacker,
                SP: CasePackerspeed
              }
              if (CasePackerflagPrint == 1) {
                for (var key in CasePackerresults) {
                  if( CasePackerresults[key] != null && ! isNaN(CasePackerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L12_LOGS/mex_pcl__CasePacker_L12.log', 'tt=' + CasePackertime + ',var=' + key + ',val=' + CasePackerresults[key] + '\n')
                }
                CasePackerflagPrint = 0
                CasePackersecStop = 0
                CasePackertime = Date.now()
              }
        //------------------------------------------CasePacker----------------------------------------------
        //------------------------------------------CaseSealer----------------------------------------------
              CaseSealerct = CntOutCaseSealer // NOTE: igualar al contador de salida
              if (!CaseSealerONS && CaseSealerct) {
                CaseSealerspeedTemp = CaseSealerct
                CaseSealersec = Date.now()
                CaseSealerONS = true
                CaseSealertime = Date.now()
              }
              if(CaseSealerct > CaseSealeractual){
                if(CaseSealerflagStopped){
                  CaseSealerspeed = CaseSealerct - CaseSealerspeedTemp
                  CaseSealerspeedTemp = CaseSealerct
                  CaseSealersec = Date.now()
                  CaseSealerdeltaRejected = null
                  CaseSealerRejectFlag = false
                  CaseSealertime = Date.now()
                }
                CaseSealersecStop = 0
                CaseSealerstate = 1
                CaseSealerflagStopped = false
                CaseSealerflagRunning = true
              } else if( CaseSealerct == CaseSealeractual ){
                if(CaseSealersecStop == 0){
                  CaseSealertime = Date.now()
                  CaseSealersecStop = Date.now()
                }
                if( ( Date.now() - ( CaseSealertimeStop * 1000 ) ) >= CaseSealersecStop ){
                  CaseSealerspeed = 0
                  CaseSealerstate = 2
                  CaseSealerspeedTemp = CaseSealerct
                  CaseSealerflagStopped = true
                  CaseSealerflagRunning = false
                  if(CntInCaseSealer - CntOutCaseSealer - CaseSealerReject.rejected != 0 && ! CaseSealerRejectFlag){
                    CaseSealerdeltaRejected = CntInCaseSealer - CntOutCaseSealer - CaseSealerReject.rejected
                    CaseSealerReject.rejected = CntInCaseSealer - CntOutCaseSealer
                    fs.writeFileSync('CaseSealerRejected.json','{"rejected": ' + CaseSealerReject.rejected + '}')
                    CaseSealerRejectFlag = true
                  }else{
                    CaseSealerdeltaRejected = null
                  }
                  CaseSealerflagPrint = 1
                }
              }
              CaseSealeractual = CaseSealerct
              if(Date.now() - 60000 * CaseSealerWorktime >= CaseSealersec && CaseSealersecStop == 0){
                if(CaseSealerflagRunning && CaseSealerct){
                  CaseSealerflagPrint = 1
                  CaseSealersecStop = 0
                  CaseSealerspeed = CaseSealerct - CaseSealerspeedTemp
                  CaseSealerspeedTemp = CaseSealerct
                  CaseSealersec = Date.now()
                }
              }
              CaseSealerresults = {
                ST: CaseSealerstate,
                CPQI : CntInCaseSealer,
                CPQO : CntOutCaseSealer,
                CPQR : CaseSealerdeltaRejected,
                SP: CaseSealerspeed
              }
              if (CaseSealerflagPrint == 1) {
                for (var key in CaseSealerresults) {
                  if( CaseSealerresults[key] != null && ! isNaN(CaseSealerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L12_LOGS/mex_pcl__CaseSealer_L12.log', 'tt=' + CaseSealertime + ',var=' + key + ',val=' + CaseSealerresults[key] + '\n')
                }
                CaseSealerflagPrint = 0
                CaseSealersecStop = 0
                CaseSealertime = Date.now()
              }
        //------------------------------------------CaseSealer----------------------------------------------
            /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/
                  if(secEOL>=60 && CntOutEOL){
                    fs.appendFileSync("C:/PULSE/L12_LOGS/mex_pcl__EOL_l12.log","tt="+Date.now()+",var=EOL"+",val="+CntOutEOL+"\n");
                    secEOL=0;
                  }else{
                    secEOL++;
                  }
            /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/
              });//Cierre de lectura

            },1000);
        });//Cierre de cliente
  client2.on('error', function(err) {
    clearInterval(intId2);
  });
  client2.on('close', function() {
  	clearInterval(intId2);
  });
//------------------------------Cerrar-código------------------------------
var shutdown = function () {
  client1.close()
  client2.close()
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
//------------------------------Cerrar-código------------------------------
}catch(err){
    fs.appendFileSync("error.log",err + '\n');
}
