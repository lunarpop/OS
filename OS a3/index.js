//var serviceTime;
var quantum;
var startTime = [];
var pList = [];
var scheduleStats = [];
var canvasWidth = 500;
var canvasHeight = 40;

var stat = function(){
	this.avgWait = 0;
	this.meanTurnAround = 0;
	this.meanNormalized = 0;
	this.finishTime = 0;
	this.idleTime = 0;
	this.CPU = 0;
}
var process = function(){
	this.arrivalTime = Math.floor(Math.random()*99 + 1);
	this.serviceTime = Math.floor(Math.random()*50 + 1);
	this.finishTime = -1;
	this.waitingTime = -1;
	this.turnAround = -1;
};

function run(){
	//serviceTime = Math.floor((Math.random() * 10) + 1);
	pList = []; //Clear out processes list
	scheduleStats = []; //Clear out the schedule
	quantum = Math.floor((Math.random() * 10) + 1); //Generate a random quantum time
	var totalProcesses = document.getElementById("processes").value;
	for(index = 0; index < totalProcesses; index++){
		//startTime[index] = Math.floor((Math.random() * 10) + 1); 
		pList.push(new process());
	}
	document.getElementById("quantum").innerHTML = "Quantum: " + quantum;

	for(var i=1; i<6; i++){
		var curCPU = "cpu" + i;
		var cpuCanvas = document.getElementById(curCPU);
		var ctx = cpuCanvas.getContext("2d");
		ctx.fillStyle = "#48CD31";
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		switch(i){
		case 1:
			scheduleStats.push(new stat());
			var percent = fcfs()*canvasWidth; //First come first serve
			document.getElementById("percent" + i).innerHTML = "CPU Usage: " + (percent/canvasWidth*100).toFixed(2) + "%";
			ctx.fillRect(0,0,percent,canvasHeight);
			document.getElementById("avgTime" + i).innerHTML = "Average Waiting Time: " + (scheduleStats[0].avgWait).toFixed(2);
			document.getElementById("meanTurn" + i).innerHTML = "Mean Turnaround: " + (scheduleStats[0].meanTurnAround).toFixed(2);
			document.getElementById("meanNorm" + i).innerHTML = "Mean Normalized: " + (scheduleStats[0].meanNormalized).toFixed(2);
			break;
		case 2:
			var percent = spnp()*canvasWidth; //Shortest process next, non-preemptive
			document.getElementById("percent" + i).innerHTML = "CPU Usage: " + (percent/canvasWidth*100).toFixed(2) + "%";
			ctx.fillRect(0,0,percent,canvasHeight);
			document.getElementById("avgTime" + i).innerHTML = "Average Waiting Time: " + (scheduleStats[1].avgWait).toFixed(2);
			document.getElementById("meanTurn" + i).innerHTML = "Mean Turnaround: " + (scheduleStats[1].meanTurnAround).toFixed(2);
			document.getElementById("meanNorm" + i).innerHTML = "Mean Normalized: " + (scheduleStats[1].meanNormalized).toFixed(2);
			break;
		case 3:
			var percent = spp()*canvasWidth; //Shortest process next, preemptive
			ctx.fillRect(0,0,percent,canvasHeight);
			break;
		case 4:
			var percent = rr()*canvasWidth; //Round robin
			ctx.fillRect(0,0,percent,canvasHeight);
			break;
		case 5:
			var percent = feedback()*canvasWidth; //Feedback algorithm
			ctx.fillRect(0,0,percent,canvasHeight);
			break;
		default:
			break;
		}
	}
	/*fcfs();
	spp();
	spnp();
	rr();
	feedback();*/
}

function fcfs(){
	pList.sort(sortByArrival);
	var curPList = "";
	var nextFreeTime = 0;
	for(var i=0; i<pList.length; i++){
		if(i > 0){
			pList[i].waitingTime = nextFreeTime - pList[i].arrivalTime;
			var idleTime = 0;
			if(pList[i].arrivalTime > nextFreeTime){
				idleTime = pList[i].arrivalTime - nextFreeTime;
				scheduleStats[0].idleTime += idleTime; //Add CPU idle time
			}
			if(pList[i].waitingTime < 0){
				pList[i].waitingTime = 0;
			}
			scheduleStats[0].avgWait += pList[i].waitingTime; // Add the already calculated waiting time to total average wait.
			//nextFreeTime += pList[i].serviceTime + idleTime; // Calculate the next free time that a process can run. Complex model
			nextFreeTime += pList[i].serviceTime; //Simple mode like book displays.
			scheduleStats[0].finishTime += nextFreeTime;
			scheduleStats[0].meanTurnAround += scheduleStats[0].finishTime - pList[i].arrivalTime;
			scheduleStats[0].meanNormalized += ((scheduleStats[0].finishTime - pList[i].arrivalTime) / pList[i].serviceTime);
		}
		else{
			nextFreeTime = pList[i].serviceTime;
			scheduleStats[0].finishTime = nextFreeTime;
			scheduleStats[0].idleTime = 0;
		}
		curPList += "p[" + i + "]: " + pList[i].waitingTime + "\n";
	}
	scheduleStats[0].avgWait = scheduleStats[0].avgWait / pList.length;
	scheduleStats[0].meanTurnAround = scheduleStats[0].meanTurnAround / pList.length;
	scheduleStats[0].meanNormalized = scheduleStats[0].meanNormalized / pList.length;
	//scheduleStats[0].CPU = (scheduleStats[0].finishTime - scheduleStats[0].idleTime) //Complex model
	scheduleStats[0].CPU = 1; //If using book model, 100% of CPU is used for FCFS
	return scheduleStats[0].CPU;
}

function spp(){
	return Math.random();
}

function spnp(){
	pList.sort(sortByBurst);
	var curPList = "";
	var nextFreeTime = 0;
	for(var i=0; i<pList.length; i++){
		alert("i: " + i);
		if(i > 0){
			pList[i].waitingTime = nextFreeTime - pList[i].arrivalTime;
			var idleTime = 0;
			if(pList[i].arrivalTime > nextFreeTime){
				idleTime = pList[i].arrivalTime - nextFreeTime;
				scheduleStats[1].idleTime += idleTime; //Add CPU idle time
			}
			if(pList[i].waitingTime < 0){
				pList[i].waitingTime = 0;
			}
			scheduleStats[1].avgWait += pList[i].waitingTime; // Add the already calculated waiting time to total average wait.
			//nextFreeTime += pList[i].serviceTime + idleTime; // Calculate the next free time that a process can run. Complex model
			nextFreeTime += pList[i].serviceTime; //Simple mode like book displays.
			scheduleStats[1].finishTime += nextFreeTime;
			scheduleStats[1].meanTurnAround += scheduleStats[1].finishTime - pList[i].arrivalTime;
			scheduleStats[1].meanNormalized += ((scheduleStats[1].finishTime - pList[i].arrivalTime) / pList[i].serviceTime);
		}
		else{
			nextFreeTime = pList[i].serviceTime;
			scheduleStats[1].finishTime = nextFreeTime;
			scheduleStats[1].idleTime = 0;
		}
		curPList += "p[" + i + "]: " + pList[i].waitingTime + "\n";
	}
	
	scheduleStats[1].avgWait = scheduleStats[1].avgWait / pList.length;
	scheduleStats[1].meanTurnAround = scheduleStats[1].meanTurnAround / pList.length;
	scheduleStats[1].meanNormalized = scheduleStats[1].meanNormalized / pList.length;
	//scheduleStats[1].CPU = (scheduleStats[1].finishTime - scheduleStats[1].idleTime) //Complex model
	scheduleStats[1].CPU = 1; //If using book model, 111% of CPU is used for FCFS
	return scheduleStats[1].CPU;
}

function rr(){
	return Math.random();
}

function feedback(){
	return Math.random();
}

/********************************/
/* 		Sorting Algorithms		*/
/********************************/
function sortByArrival(p1, p2){
	if(p1.arrivalTime < p2.arrivalTime){
		return -1;
	}
	if(p1.arrivalTime > p2.arrivalTime){
		return 1;
	}
	return 0;
}
function sortByBurst(p1, p2){
	if(p1.serviceTime < p2.serviceTime){
		return -1;
	}
	if(p1.serviceTime > p2.serviceTime){
		return 1;
	}
	return 0;
}