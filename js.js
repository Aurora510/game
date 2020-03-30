game = {
    el:null,
    startBtn:null,
    oRule:null,
    oMain:null,
    oRow:null,
    myScore:0,
    rowIndex:0,
    level:1,
    timer:null,
    isEnd:false,
    isMoveOut:false,
    init:function(options){
        this.el = options.el;
        this.popDiv = options.popDiv;
        this.oRule = options.oRule;
        this.initData();
        this.render();
        this.control();
    },
    initData:function(){
        this.oMain = this.el.getElementsByClassName('main')[0];
        this.startBtn = this.el.getElementsByClassName('startBtn')[0];
    },
    render:function(){
        this.renderRow();
    },
    renderRow:function(){
        var oRow = document.createElement('div');
        oRow.setAttribute('class','row');
        oRow.innerHTML = `
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"></div>`
        this.oMain.insertBefore(oRow,this.oMain.childNodes[0]);
        var index = this.getIndex();
        var targetDiv = oRow.getElementsByClassName('col')[index];
        targetDiv.classList.add('target')
        oRow.style.marginTop = '-'+oRow.offsetHeight + 'px';
        this.oRow = oRow;
    },
    getIndex:function(){
        return Math.floor(Math.random()*4);
    },
    control:function(){
        this.start();
        this.clickTarget();
    },
    start:function(){
        var self = this;
        this.startBtn.onclick = function(){
           this.style.display = 'none';
           self.oRule.style.display = 'none';
           self.oMain.style.display = 'block';
           self.reStart();
        } 
    },
    reStart:function(){
        this.oMain.innerHTML = '';
        this.renderRow();
        this.move();
        this.addRow();
        this.myScore = 0;
        this.isEnd = false;
        this.level = 1;
        this.isMoveOut = false;
    },
    move:function(){
        var self = this;
        self.timer = setInterval(function(){
            var count = parseInt(self.oRow.style.marginTop)
            self.oRow.style.marginTop = count + self.level + 1 + 'px';
            self.addRow();
            self.moveOut();
        },30)       
    },
    addRow:function(){
        var curRowMargin = parseInt(this.oRow.style.marginTop);
        if(curRowMargin>=0){
            this.oRow.style.marginTop = 0;
            this.renderRow();
        }
    },
    clickTarget:function(){
        var self = this;
        this.oMain.onclick = function(e){
            var isTarget = e.target.classList.contains('target');
            if(self.isEnd){return};
            if(isTarget){
                var dom = e.target;
                self.myScore++;
                dom.classList.remove('target');
                dom.style.backgroundColor = '#bbb';
                self.judgeLevel();
            }else{
                self.error();
            }
        }; 
    },
    judgeLevel:function(){
        if(this.myScore>=10){
            this.level++;
        }
    },
    moveOut:function(){
        var colCount = this.oRow.children.length;
        var rowLength = this.oMain.children.length;
        if(rowLength === 6){
            var lastRow = this.oMain.children[rowLength-1];
            for(var i = 0;i<colCount;i++){
                var isTarget = lastRow.children[i].classList.contains('target');
                if(isTarget){
                    this.isMoveOut = true;
                    this.error();
                }else{
                    lastRow.remove();
                }
            }
        }
    },
    error:function(){
        clearInterval(this.timer)
        this.isEnd = true;
        // alert('your score is ' + this.myScore)
        this.popDiv.style.display = 'block';
        this.showSore();
        this.judgeContinue();
        this.controlPop();
        
    },
    showSore:function(){
        var scoreSpan = this.popDiv.getElementsByClassName('score')[0];
        scoreSpan.innerHTML = this.myScore;
    },
    controlPop:function(){
        var self = this;
        var backBtn = this.popDiv.getElementsByClassName('back')[0];
        var againBtn = this.popDiv.getElementsByClassName('again')[0];
        var continueBtn = this.popDiv.getElementsByClassName('continue')[0];
        backBtn.onclick = function(){
            self.popDiv.style.display = 'none';
            self.oMain.style.display = 'none';
            self.startBtn.style.display = 'block';
            self.oRule.style.display = 'block';
        }
        againBtn.onclick = function(){
            self.popDiv.style.display = 'none';
            self.reStart();
        }
        continueBtn.onclick = function(){
            if(self.isMoveOut){return};
            self.popDiv.style.display = 'none';
            self.move();
            self.addRow();
            self.isEnd = false;
        }
    },
    judgeContinue:function(){
        if(this.isMoveOut){
            var continueBtn = this.popDiv.getElementsByClassName('continue')[0];
            continueBtn.style.backgroundColor = '#ccc'; 
        }else{return}
    },
}