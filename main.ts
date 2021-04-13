const X=4

const generateL=(): number=>Math.floor(Math.random()*6+5)
const generateL2=(): number=>Math.floor(Math.random()*15+1)/100
const generateInterest=(): number=>Math.floor(Math.random()*30+1)/100   // 1% - 30%

interface BankInterface{
   interest: number;
   cycleTime: number;
   commision: number;
   myFunds: number;
   index: number;
   takeFounds: (founds: number)=>number;
   makeTransfer: ()=>number;
   cycle: ()=>void;
}

interface InvestitionInterface{
   banks: BankInterface[];
   time: number;
   breakDeposit: ()=>void; 
   invest: ()=>void;
   status: ()=>void;
}

class Bank implements BankInterface{
   interest: number;
   cycleTime: number;
   commision: number;
   myFunds: number;
   index: number;

   constructor(funds: number, index: number){
      this.interest=generateInterest()
      this.cycleTime=generateL()
      this.commision=generateL2()
      this.index=index
      this.myFunds=funds

      setTimeout(() => {
         this.cycle()
      }, this.cycleTime);   
      
      console.log("cycle", this.cycleTime, " commision rate", this.commision);
   }

   takeFounds=(founds: number): number=>{
      this.myFunds+=founds
      return this.myFunds
   }

   makeTransfer=():number=>{
      let tmp=this.myFunds-(this.myFunds*this.commision)
      this.myFunds=0

      return tmp
   }

   cycle=()=>{
      this.myFunds=Math.round(this.myFunds*(1+this.interest)*100)/100
      this.interest=generateInterest()

      setTimeout(() => {
         this.cycle()
      }, this.cycleTime*1000);
   }
}


class Investition implements InvestitionInterface{
   banks: BankInterface[];
   time: number;
   
   constructor() {
      this.banks=[];
      this.time=0;

      for(let i=0;i<X;i++)
         this.banks.push(new Bank(15000, i));

      this.invest();

      setTimeout(() => {
         this.status()
      }, 10000);  //60000
   }

   breakDeposit=()=>{

   }

   invest=()=>{
      this.time++;
      
      this.banks.forEach(bank=>{         
         if(this.time%bank.cycleTime===0){
            let bankToMoveIndex=bank.index;
            let maxProfit=bank.myFunds*(1+bank.interest);

            for(let i=0;i<X;i++){               
               if(this.time%this.banks[i].cycleTime===0 && this.banks[i].index!==bank.index && bank.myFunds!==0){                  
                  let newBankProfit=(bank.myFunds-(bank.commision*bank.myFunds))*(1+this.banks[i].interest)                
                  
                  if(newBankProfit>maxProfit){
                     maxProfit=newBankProfit;
                     bankToMoveIndex=i;
                  }

                  if(bank!==this.banks[bankToMoveIndex]){
                     console.log("in second", this.time, "from bank", bank.index, "with cycle time", bank.cycleTime, "and rate equals to", bank.interest, "\nto bank", bankToMoveIndex, "with cycle time", this.banks[bankToMoveIndex].cycleTime, "with interest rate", this.banks[bankToMoveIndex].interest);
      
                     this.banks[bankToMoveIndex].takeFounds(bank.makeTransfer())                     
                  }
               }
            }
         }
         // break deposit
      })

      setTimeout(() => {
         this.invest();
      }, 1000);
   };

   status=()=>{
      let total=0;

      this.banks.forEach((bank, i) => {         
         console.log("bank", i, ": ", Math.round(bank.myFunds*100)/100);
         total += bank.myFunds;
      });

      console.log("Total: ", Math.round(total*100)/100);      

      setTimeout(() => {
         this.status();
      }, 10000);   //change to 60000
   };
}

const myInvestition=new Investition()

