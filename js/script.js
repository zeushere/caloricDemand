let form;

let genderChecked;
let heightChecked;
let weightChecked;

let activitySelection;
let goalSelection;

let ageValue;
let heightValue;
let weightValue;

let numberM;

let calculateButton;

const regAge = /^([1-9]\d*)$/;
const regDimension = /^([1-9]\d*[.,]?\d*$)$/;
const regFt = /^(?!$|.*\'[^\x22]+$)(?:([0-9]+)\')?(?:([0-9]+)\x22?)?$/;


const activityEnum = Object.freeze({"inactive":1.2, "slightActive":1.375, "moderatelyActive":1.55, "veryActive":1.725, "superActive":1.9});


function onLoad()
{

    form = document.getElementById('calculator-form');
    kcal_display = document.getElementById('kcal_display');
    bmi_display = document.getElementById('bmi_display');
    macronutrients_display = document.getElementById('macronutrients_display');
    
    typeValidation();
}


function calculateClicked()
{
        
    genderChecked = $('input[name=gender]:checked').val();
    heightChecked = $('input[name=heightChecked]:checked').val();
    weightChecked = $('input[name=weightChecked]:checked').val();

    activitySelection = $('select.activitySelection').children('option:selected').val();
    goalSelection = $('select.goalSelection').children('option:selected').val();

    ageValue = $('input[id=ageInput]').val();

    heightValue = $('input[id=heightInput]').val();
    weightValue = $('input[id=weightInput]').val();

    
    weightValue = lbToKg(weightValue,weightChecked);

    
   let heightValueInCorrectOrder = whichMeasure(heightValue,heightChecked);
    

    if(errorAge.innerHTML == "" && errorWeight.innerHTML == "" && errorHeight.innerHTML == "" && heightValue != "" && weightValue != "" && ageValue != "")

    {    
            
        bmiCalculate(weightValue, heightValueInCorrectOrder);

        let bmrKcal = bmr(genderChecked, heightChecked, ageValue, heightValueInCorrectOrder, weightValue);   

        let finalKcal = kcalAfterSelection(bmrKcal,activitySelection, goalSelection);

        macronutrientsCalculate(finalKcal,weightValue);
        
        bmi_display.style.display = 'inline';
        kcal_display.style.display = 'inline';
        macronutrients_display.style.display = 'inline';

        
        document.body.style.backgroundImage = "url('https://cdn.pixabay.com/photo/2014/10/08/20/52/cereals-480691_960_720.jpg')";
    }
}


function clearClicked()
{
    errorAge.innerHTML = '';
    errorWeight.innerHTML = '';
    errorHeight.innerHTML = '';
}



function whichMeasure(heightValue, heightChecked)
{
    
    let partInteger = new String("");
    let partDecimal = new String(".");

    let inches = new String("");

    let numberMString = new String("");

    if(heightChecked == "feet")
    {
        if(regFt.test(heightValue) == true)
        {
            for(let i = 0; i<heightValue.length; i++)
            {      
                if(heightValue[i] == "'")
                {
                    if(heightValue[heightValue.length-1] != '"')
                    {
                        break;
                    }

                    let j = ++i;
                
                while(heightValue[j] != '"')
                    {
                        inches = inches.concat(heightValue[j]);
                        j++;
                    }   
 
                    break;
                }
        
                    else
                    {
                        partInteger = partInteger.concat(heightValue[i]);    
                    }
    
            }
    
            let result = feetToM(partInteger, inches);

            return result/100;
        }
    }
    else if(heightChecked == 'm')
    {
        if(regDimension.test(heightValue) == true)
            {
                for(let i = 0; i<heightValue.length; i++)
                {
                    if(heightValue[i] == '.' || heightValue[i] == ',')
                    {
            
                        for(let j = ++i; j<heightValue.length; j++)
                        {
                            partDecimal = partDecimal.concat(heightValue[j]);
                        }

                    break;

                    }

                    else
                    {
                        partInteger = partInteger.concat(heightValue[i]);  
                    }
        
                }
    }        
       
        numberMString = numberMString.concat(partInteger+partDecimal);

        numberM = parseFloat(numberMString);

        return numberM;
        
    }

}


function typeValidation()
{
  
    
    ageInput.addEventListener('change',ageChanging);


    heightInput.addEventListener('change',heightChanging);
    
    m.addEventListener('click',heightChanging);
    feet.addEventListener('click',heightChanging);

    weightInput.addEventListener('change',weightChanging);     

    lb.addEventListener('click',weightChanging);
    kg.addEventListener('click',weightChanging);

}

function ageChanging()
{

    let ageInput = document.getElementById('ageInput');

    if ((regAge.test(ageInput.value) == false || ageInput.value<13 || ageInput.value>100) && ageInput.value != "")
            {
                errorAge.innerHTML = 'Please insert correct value! Example: "20". Caloric formulas allow you to reliably calculate the calorie requirement for people from the age of 13.';      
            }
        else
            {
                errorAge.innerHTML = '';
            }

}

function heightChanging()
{
    heightValue = $('input[id=heightInput]').val();   
    heightChecked = $('input[name=heightChecked]:checked').val();

    if(heightChecked == "m")
    {
        let heightToFloat = mForBounds(heightValue)
        
        if((regDimension.test(heightValue) == false || heightToFloat>2.4 || heightToFloat<1.1) && heightValue != "")
        {
         
            errorHeight.innerHTML = `Please insert correct value! Example: "1.85". Minimum: 1.1m, maximum: 2.4m.`;      
        }

        else 
        {
            errorHeight.innerHTML = '';
        }
    }

    else if(heightChecked == "feet")
    {    
        let heightToFloat = parseFloat(feetInMForBounds(heightValue));

        if((regFt.test(heightInput.value) == false || heightToFloat>2.4 || heightToFloat<1.1) && heightInput.value != "")
        {
            errorHeight.innerHTML = `Please insert correct value! Example: "6'1"". Minimum: 3'8", maximum: 7'9".`;      
        }

        else 
        {
            errorHeight.innerHTML = '';
        }
    }
    
}

function weightChanging ()
{
    
    let weightInput = document.getElementById('weightInput');
    weightChecked = $('input[name=weightChecked]:checked').val();

        if(weightChecked == "kg")
            {
                if((regDimension.test(weightInput.value) == false || weightInput.value <40 ) && weightInput.value != "" )
                {
                    errorWeight.innerHTML = 'Please insert correct kg value! Example: "100". Minimum: 40kg.';    
                }
                else
                {
                errorWeight.innerHTML = '';
                }
            }

        else if(weightChecked == "lb")
            {
            
                if((regDimension.test(weightInput.value) == false || weightInput.value <88.2) && weightInput.value != "" )
                {
                    errorWeight.innerHTML = 'Please insert correct pounds value! Example: "130". Minimum: 88.2lbs.';    
                }
            
                else
                {
                    errorWeight.innerHTML = '';
                }
            
            }
    
    }

 
function mForBounds(heightValue)
{
    let partInteger = new String("");
    let partDecimal = new String(".");

    let numberMString = new String("");
    
    for(let i = 0; i<heightValue.length; i++)
                {
                    if(heightValue[i] == '.' || heightValue[i] == ',')
                    {
            
                        for(let j = ++i; j<heightValue.length; j++)
                        {
                            partDecimal = partDecimal.concat(heightValue[j]);
                        }

                    break;

                    }

                    else
                    {
                        partInteger = partInteger.concat(heightValue[i]);  
                    }
        
                }
            
       
        numberMString = numberMString.concat(partInteger+partDecimal);

        numberM = parseFloat(numberMString);

        return numberM;
}

function feetInMForBounds(value)
{
    let partInteger = new String("");
    let inches = new String("");

    for(let i = 0; i<value.length; i++)
        {
        
        if(value[i] == "'")
            {

            if(heightValue[value.length-1] != '"')
                {
                    break;
                }

            let j = ++i;
        

            while(value[j] != '"')
            {  
                inches = inches.concat(value[j]);
                j++;
            }   

            break;
            }

                else
                {
                    partInteger = partInteger.concat(value[i]);               
                }

            }

    let result = feetToM(partInteger, inches);

    return result/100;
}


function lbToKg (value, weightChecked)
{
    if(weightChecked == 'lb')
    {
        let kgValue = value/2.204623;
        return kgValue;
    }
    return value;
}

function feetToM(partInteger, inches)
{ 
    let mValue = (30.48*partInteger) + (2.54*inches); 
    return mValue;
}


function bmr(genderChecked, heightChecked, ageValue, heightValueInCorrectOrder, weightValue)
{
    let bmrKcal;
  
   if(heightChecked == 'feet')
   {
        heightValue = feetToM(heightValueInCorrectOrder);
   }

   if(genderChecked == 'female')
   {
        bmrKcal = ((10 * weightValue) + (6.25 * (heightValueInCorrectOrder * 100)) - (5 * ageValue) - 161);   
   }

   else if(genderChecked == 'male')
   {
        bmrKcal = ((10 * weightValue) + (6.25 * (heightValueInCorrectOrder * 100)) - (5 * ageValue) + 5);   
   }

        return bmrKcal.toFixed(0);
}


function bmiCalculate(weightValue, heightValueInCorrectOrder)
{

    heightValueInCorrectOrder = heightValueInCorrectOrder.toFixed(2);

    let bmiResult = (weightValue/(heightValueInCorrectOrder * heightValueInCorrectOrder));


    bmiResult = bmiResult.toFixed(1);

    if(bmiResult < 18.5)
    {
        bmi_display.innerHTML = `<p> Your BMI is <strong>${bmiResult}</strong>. You are <strong>underweight</strong>. Remember that the BMI is only reliable if you are not a physically active person.`;
    }

    else if(bmiResult >= 18.5 && bmiResult <= 24.9)
    {
        bmi_display.innerHTML = `<p> Your BMI is <strong>${bmiResult}</strong>. You have the <strong>correct weight</strong>. Remember that the BMI is only reliable if you are not a physically active person`;
    }

    else if(bmiResult >= 25 && bmiResult <= 29.9)
    {
        bmi_display.innerHTML = `<p> Your BMI is <strong>${bmiResult}</strong>. You are the <strong>overweight</strong>. Remember that the BMI is only reliable if you are not a physically active person`;
    }
    
    else if(bmiResult >= 30)
    {
        bmi_display.innerHTML = `<p> Your BMI is <strong>${bmiResult}</strong>. You are the <strong>obese</strong>. Remember that the BMI is only reliable if you are not a physically active person`;
    }
}


function kcalAfterSelection(bmrKcal, activitySelection, goalSelection)
{

    
    let kcalAfterActivity = activityEnum[activitySelection] * bmrKcal
    
    if(goalSelection == 'weightKeep')
    {
        kcal_display.innerHTML = `<p>Your basal metabolic rate (BMR) is: <strong>${bmrKcal} </strong> calories a day.</p>
        <p>If you want to keep weight, you should eat <strong>${kcalAfterActivity.toFixed(0)}</strong> calories a day.</p>`;
    }

    else if(goalSelection == 'weightGain')
    {
        kcalAfterActivity = kcalAfterActivity*1.1;

        kcal_display.innerHTML = `<p>Your basal metabolic rate (BMR) is: <strong>${bmrKcal} </strong> calories a day.</p>
        <p>If you want to gain weight, you should eat <strong>${kcalAfterActivity.toFixed(0)}</strong> calories a day.</p>`;
    }

    else if(goalSelection == 'weightLoss')
    {
        kcalAfterActivity = kcalAfterActivity*0.85;

        kcal_display.innerHTML = `<p>Your basal metabolic rate (BMR) is: <strong>${bmrKcal} </strong> calories a day.</p>
        <p>If you want to lose weight, you should eat <strong>${kcalAfterActivity.toFixed(0)}</strong> calories a day.</p>`;
    }
    
    return kcalAfterActivity.toFixed(0);
    
}


function macronutrientsCalculate(finalKcal, weightValue)
{
   
    let protein = (weightValue * 2).toFixed(0);
   
    let fats = ((finalKcal * 0.25)/9).toFixed(0);

    let carbohydrates = ((finalKcal - (protein*4) - (fats*9))/4).toFixed(0);

    macronutrients_display.innerHTML = `<p>For that, you should eat about <strong>${protein}</strong>g of protein, <strong>${fats}</strong>g of fats and <strong>${carbohydrates}</strong>g of carbohydrates a day.</p>
    <input id = "back" onclick="backClicked()"
        type="button"
        value="Back">`;
      
        form.style.display = 'none';
        
    
}



function backClicked()
{
    
    form.style.display = 'inline';
    bmi_display.style.display = 'none';
    kcal_display.style.display = 'none';
    macronutrients_display.style.display = 'none';

    $('#calculator-form').trigger("reset");

    errorAge.innerHTML = '';
    errorHeight.innerHTML = '';
    errorWeight.innerHTML = '';

    document.body.style.backgroundImage = "url('https://cdn.pixabay.com/photo/2017/07/22/08/49/cute-2528119_960_720.jpg')";

}