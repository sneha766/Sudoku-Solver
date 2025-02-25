let temp = [[],[],[],[],[],[],[],[],[]];
let fixedcells = [];
for(let i =0;i<9;i++){
    for(let j =0;j<9;j++){
       temp[i][j] = document.getElementById(i*9 + j);
    }
}

let board = [[],[],[],[],[],[],[],[],[]];

function addvalue(board){
    for(let i =0;i<9;i++){
        for(let j =0;j<9;j++){
           if(board[i][j] != 0){
            temp[i][j].innerText = board[i][j];
            if (fixedCells[i][j]) {
                temp[i][j].style.backgroundColor = "rgb(207, 204, 204)"; 
            }else {
                temp[i][j].style.backgroundColor = "#ffffff"; 
                temp[i][j].style.fontWeight = "normal";
            }
           }
           else{
            temp[i][j].innerText = '';
            temp[i][j].style.backgroundColor = "#ffffff";
                temp[i][j].style.fontWeight = "normal";
           }
        }
    }
}

let GetPuzzle = document.getElementById('get');
let Solvepuzzle = document.getElementById('solve');
GetPuzzle.onclick = function () {
	var xhrRequest = new XMLHttpRequest()
	xhrRequest.onload = function () {
		var response = JSON.parse(xhrRequest.response)
		console.log(response)
		board = response.board
        fixedCells = board.map(row => row.map(value => value !== 0));
		addvalue(board)
	}
	xhrRequest.open('get', 'https://sugoku.onrender.com/board?difficulty=easy')
	xhrRequest.send();
}
Solvepuzzle.onclick = ()=>{
    solver(board,0,0,9);
};
function Safe( board, r, c, num){
    for(let i =0;i<9;i++){
        if(board[r][i] == num){
            return false;
        }
     }
    for(let i =0;i<9;i++){
        if(board[i][c] == num){
            return false;
        }
    }
    let start = r - r%3 , end = c - c%3;
    for(let i = start;i<start+3;i++){
        for(let j = end;j<end + 3;j++){
            if(board[i][j]==num){
                return false;
            }
        }
    }
    return true;

}

async function solver(board,r,c,n){
    if(r==9) {
        addvalue(board);
        return true;}
    if(c==9) {
        return await solver(board,r+1,0,n);}
    if(board[r][c] != 0) return await solver(board,r,c+1,n);

    for(let i = 1;i<=9;i++){
        
        if(Safe(board,r,c,i)){
            board[r][c] = i;
            addvalue(board);
            await new Promise(resolve => setTimeout(resolve,10));
            if (await solver(board,r,c+1,n)) {
              return true;
            } 
            board[r][c] = 0;
            addvalue(board);

            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }
    return false;
}