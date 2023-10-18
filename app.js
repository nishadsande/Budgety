var budgetControl = (function(){

    var Expense = function(Id, description,value){
        this.id= Id;
        this.description = description;
        this.value = value;
        this.percentage =-1;
    };
    Expense.prototype.calcper= function(totalincome){

        if (totalincome>0){
            this.percentage =Math.round((this.value/totalincome)*100) ;
        } else{
            this.percentage=-1;
        }
        
    }
    Expense.prototype.getper = function(){
        return this.percentage;
    }
    var Income = function(id, description,value){
        this.id= id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function(type){

        var sum=0;
         data.allitems[type].forEach(cur =>{
             sum+= cur.value;
         });

         data.total[type] = sum;

    }

    var data={
        allitems :{
              exp: [],
              inc :[],
        },
        total :{
            exp : 0,
            inc :0,
        },
        Budget : 0,
        percentage : 0
    } ;
    return {
        addItem : function(type, des, val){
            var newItem, Id;

            if(data.allitems[type].length>0){
                Id= data.allitems[type][data.allitems[type].length-1].id+1;
            }else{ 
                Id=0;
            }

            
             
            if(type==='exp'){
            newItem = new Expense(Id,des,val)
            } else if(type==='inc'){
                newItem = new Income(Id,des,val)
            }

            data.allitems[type].push(newItem);
            return newItem;

        },  
        deleteItem : function(type, id){
            var ids, index;
            ids = data.allitems[type].map(function (current) {
              return   current.id;});
            index = ids.indexOf(id);

            if(index!==-1){
                data.allitems[type].splice(index,1);
            }



        },
        calculateBudget: function(){
            calculateTotal('exp');
            calculateTotal('inc');

            data.Budget= data.total.inc - data.total.exp;

            if(data.total.inc>0){
                data.percentage = Math.round((data.total.exp/data.total.inc)*100);
            }else {
                data.percentage =-1;
            }

           



        },
        calculatepercentage : function(){
            
         data.allitems.exp.forEach(cur =>{
             cur.calcper(data.total.inc);
         })

        },

        getpercentage : function(){
           var getp = data.allitems.exp.map(cur=>{
              return cur.getper();
           });
           return getp;
        },
        getbudget : function(){
            return {
                budget : data.Budget,
                totalinc : data.total.inc,
                totalexp : data.total.exp,
                per : data.percentage
            }

        },

        testing: function(){
            console.log(data);
        }

        
    };


})();

var uicontrol = (function(){
    var DOMstrings ={
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn',
        incomecontainer : '.income__list',
        expensecontainer : '.expenses__list',
        netbudget : '.budget__value',
        netincome : '.budget__income--value',
        netexpense :'.budget__expenses--value',
        netpercentage:'.budget__expenses--percentage',
        container : '.container',
        expenseperlable : '.item__percentage',
        datelable : '.budget__title--month'
 }
    var formatenum = function(num, type){
    var numsplit , int , dec;
   num = Math.abs(num);
   num= num.toFixed(2);
   numsplit = num.split('.');
   int =numsplit[0];
   dec = numsplit[1];

   if(int.length>3){
      int= int.substr(0,int.length-3) + ',' + int.substr(int.length-3, 3)
   }
   return (type=== 'exp' ? '-' : '+') + ' ' +  int + '.' + dec;

};


    return {
        getInput : function(){
            return {
                type : document.querySelector(DOMstrings.inputType).value,
                description :document.querySelector(DOMstrings.inputDescription).value,

                value :parseFloat( document.querySelector(DOMstrings.inputValue).value)
            };
        },
        addlistItem : function(obj,type){
            var html, newhtml, element;
             if(type==='inc'){
                 element=DOMstrings.incomecontainer;
            html= '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button</div> </div></div>' ;
             } else if(type==='exp'){
                 element=DOMstrings.expensecontainer;
            html ='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div</div>' ;
             }

            newhtml = html.replace('%id%', obj.id);
            newhtml = newhtml.replace('%description%' , obj.description);
            newhtml = newhtml.replace('%value%' , formatenum(obj.value,type) );

            document.querySelector(element).insertAdjacentHTML('beforeend' , newhtml);

        },
        deleteListItem : function(selectorId){

            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);

        }
        , 
        clearField : function(){

            var field =document.querySelectorAll(DOMstrings.inputDescription +', ' + DOMstrings.inputValue);
          var fieldarr=Array.prototype.slice.call(field);

          fieldarr.forEach(current => {
              current.value="";
         });
         fieldarr[0].focus();
        },
        getDomStrings : function(){
            return DOMstrings;
        },


        Displaypercentage : function(percentages){
            var field = document.querySelectorAll(DOMstrings.expenseperlable);
            var fieldar = Array.prototype.slice.call(field);

            fieldar.forEach((cur,index)=>{
                if(percentages[index]>0){
                cur.textContent = percentages[index] +'%';
                   
                }else {
                    cur.textContent='---';
                }
            })

        },
        Displaybudget : function(obj){
            var type;

            obj.budget>0? type = 'inc' : type='exp'
            document.querySelector(DOMstrings.netbudget).textContent = formatenum(obj.budget,type) ;
            document.querySelector(DOMstrings.netincome).textContent = formatenum(obj.totalinc,'inc');
            document.querySelector(DOMstrings.netexpense).textContent = formatenum(obj.totalexp,'exp');

            if(obj.per>0){
            document.querySelector(DOMstrings.netpercentage).textContent = obj.per +' %';
               
            }else{
            document.querySelector(DOMstrings.netpercentage).textContent = '--';

            }

        },Displaydate : function(){
            var now , month, months, year;

            now = new Date();
            year = now.getFullYear();
            months=['Jan' , 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep' , 'Oct', 'Nov' , 'Dec' ];
            month = now.getMonth();


            document.querySelector(DOMstrings.datelable).textContent= months[month] +" "+  year;

        },
        changedType : function(){
            var field= document.querySelectorAll(DOMstrings.inputType +','+ DOMstrings.inputDescription +','+ DOMstrings.inputValue);
             var filedarray = Array.prototype.slice.call(field);

             filedarray.forEach(cur =>{
                 cur.classList.toggle('red-focus');
             });

             document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        }

       
    };

})();



var appcontrol = (function(budgetcntrl ,uicntrl){

     var setUpEventListener =function(){
        var Dom = uicntrl.getDomStrings();
        document.querySelector(Dom.inputBtn).addEventListener('click' , ctrlAdditem);

    document.addEventListener('keypress' , function(event){

        if(event.keyCode===13 || event.which===13){
         ctrlAdditem();
        }
    });
    document.querySelector(Dom.container).addEventListener('click',ctrlDeleteitem );

    document.querySelector(Dom.inputType).addEventListener('change' , uicntrl.changedType);
   };
    var updateBudget = function(){
        //1. calculate the budget
        budgetcntrl.calculateBudget();

        //2. return the budget
        var budGet = budgetcntrl.getbudget();
        
       
        

        //3. Display the budget on UI
        uicntrl.Displaybudget(budGet);
    };

    var updatepercentage = function(){
        budgetcntrl.calculatepercentage();
        var percentage = budgetcntrl.getpercentage();
        
        uicntrl.Displaypercentage(percentage);

    };

    
     function ctrlAdditem(){

        var input = uicntrl.getInput();
         
        if(input.description!=="" && !isNaN(input.value) &&input.value>0 ){
            var newItem = budgetcntrl.addItem(input.type,input.description,input.value);

            uicntrl.addlistItem(newItem, input.type);
            uicntrl.clearField();
            
            updateBudget();
            updatepercentage();
        }
    }
     
    var ctrlDeleteitem = function(event){
        typeId =event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(typeId){
            splitId = typeId.split('-');
            type = splitId[0];
            ID = parseInt(splitId[1]);

            budgetcntrl.deleteItem(type , ID);
            uicntrl.deleteListItem(typeId);
            updateBudget();
            updatepercentage();

        }
    }

    

return{
    init : function(){
        console.log(' application has just started');
        uicntrl.Displaydate();
        uicntrl.Displaybudget({
            budget : 0,
            totalinc : 0,
            totalexp : 0,
            per : -1
        }
);

        setUpEventListener();

    }
}
    
})(budgetControl,uicontrol);

appcontrol.init();