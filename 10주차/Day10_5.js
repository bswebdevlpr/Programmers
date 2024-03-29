// 코딩테스트 연습
// 힙(Heap)
// 디스크 컨트롤러

function solution(jobs) {
    /*
        1. 하드디스크가 작업을 수행하지 않고 있을 때에는 먼저 요청이 들어온 작업부터 처리한다.
            1.1) 작업이 끝난 시점에 들어온 요청을 요청 array에 넣어준다.
        2. 하드디스크가 작업을 수행하고 있을 때,
            2.1) 수행하고 있는 작업이 끝나는 시점까지 들어온 요청을 스택에 오름차순으로 정렬한다.
            2.2) 2.1을 반복하고 stack이 없다면 1으로 돌아간다. 
    */
    
    let requested = [];
    let nowWork = null;
    let time = 0;
    let amount = 0;
    
    jobs = jobs.sort((a, b) => {
        if(a[0] !== b[0]) return a[0] - b[0];
        else return a[1] - b[1];
    });
    let jobIdx = jobs.map((job, index) => {
       return {start: job[0], cost: job[1], realCost: 0, index: index}
        /*
            - realCost: 실제로 작업이 시작된 시점부터 끝난 시점까지 걸린 시간.
        */
    });
    
    // console.log(jobIdx);
    
    // jobIdx에서 조건에 해당하는 job을 shift하여 requested에 push.
    function inputRequest(){
        let inputCnt = 0;
        let workingTime = nowWork.start + nowWork.realCost;
        for(let i=0; i<jobIdx.length; i++){
            if(jobIdx[i].start < workingTime){
                inputCnt++;
            } else break;
        }
        
        while(inputCnt > 0){
            requested.push(jobIdx.shift());
            inputCnt--;
        }
    }
    
    nowWork = jobIdx.shift();
    nowWork.realCost = nowWork.cost;
    time = nowWork.start;
    
    while(jobIdx.length > 0 || nowWork || requested.length > 0){
        if(jobIdx.length === 0 && requested.length === 0 && nowWork) {
            amount += nowWork.realCost;
            break;
        }
        if(!nowWork){
            if(requested.length > 1){
                let first = jobs.length;
                let idx = 0;
                // 가장 먼저 요청된 job의 index를 찾음.
                for(let i=0; i<requested.length; i++){
                    if(first > requested[i].index){
                        first = requested[i].index;
                        idx = i;
                    }
                }
                nowWork = requested[idx];
                let head = requested.slice(0, idx);
                let rear = requested.slice(idx+1, requested.length);
                requested = head.concat(rear);
                
                nowWork.realCost = (time - nowWork.start) + nowWork.cost;
                
            } else if(requested.length === 1){
                nowWork = requested.shift();
                nowWork.realCost = (time - nowWork.start) + nowWork.cost;
                
            } else{
                nowWork = jobIdx.shift();
                nowWork.realCost = nowWork.cost;
                time = nowWork.start;
            }
        } else {
            if(time === nowWork.start + nowWork.realCost){
                amount += nowWork.realCost;
                
                if(requested.length > 0){
                    requested = requested.sort((a, b) => {
                        if(a.cost !== b.cost) return a.cost - b.cost;
                        else return a.index - b.index;
                    });
                    nowWork = requested.shift();
                    nowWork.realCost = (time - nowWork.start) + nowWork.cost;
                } else{
                    nowWork = jobIdx.shift();
                    nowWork.realCost = nowWork.cost;
                    time = nowWork.start;
                }
            }
        }
        
        inputRequest();
        // console.log("time="+time) 
        // console.log("amount="+amount);
        // console.log("nowWork: ", nowWork)
        // console.log("requested: ", requested, '\n');
        time += nowWork.cost;
    }
    
    
    var answer = Math.floor(amount/jobs.length);
    return answer;
}