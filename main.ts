const X=4   //number of banks

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
   breakDeposit: (bank: BankInterface)=>void;
   chooseBank: (bank: BankInterface)=>void;
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
      this.interest=generateInterest();
      this.cycleTime=generateL();
      this.commision=generateL2();
      this.index=index;
      this.myFunds=funds;   

      setTimeout(() => {
         this.cycle();
      }, this.cycleTime);   
      
      console.log("Bank", this.index, ":  cycle", this.cycleTime, " commision rate", this.commision);
   }

   takeFounds(founds: number):number{
      this.myFunds+=founds;
      return this.myFunds;
   }

   makeTransfer():number{
      let tmp=this.myFunds*(1-this.commision);
      this.myFunds=0;

      return tmp;
   }

   cycle(){
      this.myFunds=Math.round(this.myFunds*(1+this.interest)*100)/100;
      this.interest=generateInterest();    

      setTimeout(() => {
         this.cycle();
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
      }, 60000);
   }

   chooseBank(bank: BankInterface){
      let bankToMoveIndex=bank.index;
      let maxProfit=bank.myFunds*(1+bank.interest);

      for(let i=0;i<X;i++){           
         if(this.time%this.banks[i].cycleTime===0 && this.banks[i].index!==bank.index){                  
            let newBankProfit=(bank.myFunds-(bank.commision*bank.myFunds))*(1+this.banks[i].interest);
            
            if(newBankProfit>maxProfit){
               maxProfit=newBankProfit;
               bankToMoveIndex=i;
            }
         }
      }

      if(bankToMoveIndex!==bank.index){
         console.log("in second", this.time, "transfer deposit from bank", bank.index, "with interest rate equals to", bank.interest, "to bank", bankToMoveIndex, "with interest rate", this.banks[bankToMoveIndex].interest, ", cost of transfer", Math.round(bank.commision*bank.myFunds*100)/100);

         this.banks[bankToMoveIndex].takeFounds(bank.makeTransfer());
      }
   }

   breakDeposit(bank: BankInterface){
      let oldBankProfit=bank.myFunds*(1+bank.interest);
      let bankToMoveIndex=bank.index;
      let maxProfit=0;

      for(let i=0;i<X;i++){
         if(this.time%this.banks[i].cycleTime===0 && this.banks[i].index!==bank.index){
            let newBankProfit=(bank.myFunds*(1-bank.commision))*(1+this.banks[i].interest)-oldBankProfit;

            if(this.banks[i].cycleTime-(this.time%this.banks[i].cycleTime) <= bank.cycleTime-(this.time%bank.cycleTime) && newBankProfit>maxProfit){
               maxProfit=newBankProfit;
               bankToMoveIndex=i;
            }
         }
      }

      if(bankToMoveIndex!=bank.index){
         console.log("in second", this.time, "break deposit, from bank", bank.index, "with interest rate equals to", bank.interest, "to bank", bankToMoveIndex, "with interest rate", this.banks[bankToMoveIndex].interest, ", overall cost of braking deposit", Math.round(((bank.commision*bank.myFunds)+(bank.myFunds*bank.interest))*100)/100);

         this.banks[bankToMoveIndex].takeFounds(bank.makeTransfer());
      }
   }

   invest(){
      this.time++;
      
      this.banks.forEach(bank=>{         
         if(this.time%bank.cycleTime===0)
            this.chooseBank(bank);
         else
            this.breakDeposit(bank);
      })

      setTimeout(() => {
         this.invest();
      }, 1000);
   };

   status(){
      let total=0;
      console.log("SUMMARY");
      

      this.banks.forEach((bank, i) => {         
         console.log("Bank", i, ": ", Math.round(bank.myFunds*100)/100);
         total += bank.myFunds;
      });

      console.log("Total: ", Math.round(total*100)/100);      

      setTimeout(() => {
         this.status();
      }, 60000);
   };
}


const myInvestition=new Investition();