 import React, { useState } from "react";
import "./ConferenceEvent.css";
import TotalCost from "./TotalCost";
import { useSelector, useDispatch } from "react-redux"; //Retrieves venue items from the Redux store state
import { incrementQuantity, decrementQuantity } from "./venueSlice";
import { incrementAvQuantity, decrementAvQuantity } from "./avSlice";
import { toggleMealSelection } from "./mealsSlice";
const ConferenceEvent = () => {
    const [showItems, setShowItems] = useState(false);
    const [numberOfPeople, setNumberOfPeople] = useState(1);
    const venueItems = useSelector((state) => state.venue); //Retreving venue items from Redux store state
    const avItems = useSelector((state) => state.av);  //Retreve av items from redux store state
    const mealsItems = useSelector((state) => state.meals); //Retreve meal items from redux store state
    const dispatch = useDispatch();
    const remainingAuditoriumQuantity = 3 - venueItems.find(item => item.name === "Auditorium Hall (Capacity:200)").quantity; //Prevents user from ordering more Aud halls then avaliable
    
    const handleToggleItems = () => {
        console.log("handleToggleItems called");
        setShowItems(!showItems);
    };
    /*
    Handles how many of events, Meal, and Addons can be added/removed to the cart. 
    */
    const handleAddToCart = (index) => {
        if (venueItems[index].name === "Auditorium Hall (Capacity:200)" && venueItems[index].quantity >= 3) {
          return; 
        }
        dispatch(incrementQuantity(index));
    };
    
    const handleRemoveFromCart = (index) => {
        if (venueItems[index].quantity > 0) {
          dispatch(decrementQuantity(index));
        }
    };
    
    const handleIncrementAvQuantity = (index) => {
        dispatch(incrementAvQuantity(index));
    };

    const handleDecrementAvQuantity = (index) => {
        dispatch(decrementAvQuantity(index));
    };

    /*
        The function takes an index parameter of the meal item that triggered the selection
        It retrieves the meal item object from the mealsItems array using the provided index
        It checks if the retrieved item is both selected, item.selected === true and that its type is mealForPeople
        If these two conditions are met, it prepares to update the numberOfPeople state variable before toggling the selection
        If the item is of type mealForPeople and already selected, item.selected is true, it maintains the current numberOfPeople
        If not selected, it sets numberOfPeople to 0
        It dispatches the toggleMealSelection action with the index of the item and, if applicable, the new numberOfPeople
        If the item is not of type mealForPeople or is not selected, it dispatches an action to toggle the meal selection without any additional considerations
    */
   
    const handleMealSelection = (index) => {
       const item = mealsItems[index];
       if (item.selected && item.type === "mealForPeople") {
        //Ensure numberOfPeople is set before toggling selection
        const newNumberOfPeople = item.selected ? numberOfPeople : 0;
        dispatch(toggleMealSelection(index, newNumberOfPeople));
       } else {
        dispatch(toggleMealSelection(index));
       }
    };

    /*
        will store all items the user has selected and store them in an array to be
        calculated later.
    */
    const getItemsFromTotalCost = () => {
        const items = []; //Takes all items from venue, av, and meals and adds them to this array
        venueItems.forEach((item) => { //venue
            if(item.quantity > 0) {
                items.push({ ...item, type: "venue"});
            }
        });
        avItems.forEach((item) => { //av
            if (
                item.quantity > 0 &&
                !items.some((i) => i.name === item.name && i.type == "av")
            ) {
                items.push({ ...item, type: "av"});
            }
        }); 
        mealsItems.forEach((item) => { //meals 
            if ( item.selected) {
                const itemForDisplay = { ...item, type: "meals"};
                if (item.numberOfPeople) {
                    itemForDisplay.numberOfPeople = numberOfPeople;
                }
                items.push(itemForDisplay);
            }
        });
        return items; 
    };

    const items = getItemsFromTotalCost();

    /** 
     * Creates logic to display all items details as a table
     * Layout is in 4 columns Name, Unit Cost, Quantity, and Subtotal'
     * It iterates the array using a map function
     * Each item create a table row <tr>
     * In reach row item name, cost
     * rooms and addon will dispaly the quantity of the item 
     * meals it will use numberOfPeopel
    */
    const ItemsDisplay = ({ items }) => {
        console.log(items);
        return <>
            <div className="display_box1">
                {/*If no items in the display*/}
                {items.length === 0 && <p>No items selected</p>}
                <table className="table_item_data"> 
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Unit Cost</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>${item.cost}</td>
                                <td> 
                                    {item.type === "meals" || item.numberOfPeople
                                    ? ` For ${numberOfPeople} people `
                                    : item.quantity}
                                </td>
                                <td>{item.type === "meals" || item.numberOfPeople
                                    ? `${item.cost * numberOfPeople}`
                                    : `${item.cost * item.quantity}`}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    };
    /*
    Adds the cost of all Venues in the cart
    using arrow function syntax 
    section: is a string parameter that indicat the section is calculated
    venueItems: iteam array represent an item with properties cost and quantity

    */
    const calculateTotalCost = (section) => {
        let totalCost = 0;
        if (section === "venue") {
          venueItems.forEach((item) => {
            totalCost += item.cost * item.quantity;
          });
        } else if (section == "av") {
            avItems.forEach((item) => {
                totalCost += item.cost * item.quantity;
            });
        } else if (section == "meals") {
            mealsItems.forEach((item) => {
                if(item.selected) {
                    totalCost += item.cost * numberOfPeople;
                }
            });
        }
        return totalCost;
      };
    const venueTotalCost = calculateTotalCost("venue");
    const avTotalCost = calculateTotalCost("av");
    const mealsTotalCost = calculateTotalCost("meals");
    
    const navigateToProducts = (idType) => {
        if (idType == '#venue' || idType == '#addons' || idType == '#meals') {
          if (showItems) { // Check if showItems is false
            setShowItems(!showItems); // Toggle showItems to true only if it's currently false
          }
        }
    }
    const totalCosts = {
        venue: venueTotalCost,
        av: avTotalCost,
        meals: mealsTotalCost,
    };

    return (
        <>
            <navbar className="navbar_event_conference">
                <div className="company_logo">Conference Expense Planner</div>
                <div className="left_navbar">
                    <div className="nav_links">
                        <a href="#venue" onClick={() => navigateToProducts("#venue")} >Venue</a>
                        <a href="#addons" onClick={() => navigateToProducts('#addons')}>Add-ons</a>
                        <a href="#meals" onClick={() => navigateToProducts('#meals')}>Meals</a>
                    </div>
                    <button className="details_button" onClick={() => setShowItems(!showItems)}>
                        Show Details
                    </button>
                </div>
            </navbar>
            <div className="main_container">
                {!showItems
                    ?
                    (
                        <div className="items-information">
                             <div id="venue" className="venue_container container_main">
        <div className="text">
 
          <h1>Venue Room Selection</h1>
        </div>
        <div className="venue_selection">
          {venueItems.map((item, index) => (
            <div className="venue_main" key={index}>
              <div className="img">
                <img src={item.img} alt={item.name} />
              </div>
              <div className="text">{item.name}</div>
              <div>${item.cost}</div>
     <div className="button_container">
        {venueItems[index].name === "Auditorium Hall (Capacity:200)" ? (

          <>
          <button
            className={venueItems[index].quantity === 0 ? "btn-warning btn-disabled" : "btn-minus btn-warning"}
            onClick={() => handleRemoveFromCart(index)}
          >
            &#8211;
          </button>
          <span className="selected_count">
            {venueItems[index].quantity > 0 ? ` ${venueItems[index].quantity}` : "0"}
          </span>
          <button
            className={remainingAuditoriumQuantity === 0? "btn-success btn-disabled" : "btn-success btn-plus"}
            onClick={() => handleAddToCart(index)}
          >
            &#43;
          </button>
        </>
        ) : (
          <div className="button_container">
           <button
              className={venueItems[index].quantity ===0 ? " btn-warning btn-disabled" : "btn-warning btn-plus"}
              onClick={() => handleRemoveFromCart(index)}
            >
               &#8211;
            </button>
            <span className="selected_count">
              {venueItems[index].quantity > 0 ? ` ${venueItems[index].quantity}` : "0"}
            </span>
            <button
              className={venueItems[index].quantity === 10 ? " btn-success btn-disabled" : "btn-success btn-plus"}
              onClick={() => handleAddToCart(index)}
            >
             &#43;
            </button>
            
            
          </div>
        )}
      </div>
            </div>
          ))}
        </div>
        <div className="total_cost">Total Cost: ${venueTotalCost}</div>
      </div>

        {/*Necessary Add-ons*/}
        <div id="addons" className="venue_container container_main">

            <div className="text">

                <h1> Add-ons Selection</h1>

            </div>
            {/*avItems: array that contains AV equipment 
            map iterates through the array creates a div tag
            for each element */}
            <div className="addons_selection">
                {avItems.map((item, index) => (
                    <div className="av_data venue_main" key={index}>
                        <div className="img"> {/*Image for the AV equipment*/}
                            <img src={item.img} alt={item.name}/>
                        </div>
                        <div className="text"> {item.name} </div> {/*Displays name of the av equipment */}
                            <div> ${item.cost} </div>
                                <div className="addons_btn">
                                    {/*Buttons for incrementining and decrementing for av equipment */}
                                    <button className="btn-warning" onClick={() => handleDecrementAvQuantity(index)}> &ndash; </button>
                                    <span className="quantity-value">{item.quantity}</span> {/*Dispalys current av Quantity */}
                                    <button className="btn-success" onClick={() => handleIncrementAvQuantity(index)}> &#43; </button>
                                </div>
                            </div>
                        ))}
                        </div>
                        <div className="total_cost">Total Cost:{avTotalCost}</div>

                    </div>

                    {/* Meal Section */}
                    <div id="meals" className="venue_container container_main">
                        <div className="text">
                            <h1>Meals Selection</h1>
                        </div>
                        {/**creates a labled input field for specifiying the number of poeple. It uses an <input> element
                         * of type number with a minimum vale of 1 and updates the numberOfpeople state with the parsed
                         * intger value entered by the user
                         */}
                        <div className="input-container venue_selection">
                            <label htmlFor="numberOfPeople"><h3>Number of People:</h3></label>
                            <input type="number" className="input_box5" id="numberOfPeople" value={numberOfPeople}
                                onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                                min="1"
                            />
                        </div>
                        
                        <div className="meal_selection">{/**Container for the list of meal items */}
                            {mealsItems.map((item, index) => (
                                <div className="meal_item" key={index} style={{padding: 15}}> 
                                {/**This is a container for each meal item The key prop is necessary for React to keep track of each item in the list */}
                                    <div className="inner">
                                        <input type="checkbox" id={ `meal_${index}`}
                                            checked={ item.selected }
                                            onChange={() => handleMealSelection(index)}
                                            /*Above code is a checkbox input element. The selected property of the 
                                            current item controls its checked property. When the checkbox state changes,
                                            it triggers the handleMealSelection() function with the current items index*/
                                        />
                                        <label htmlFor={`meal_${index}`}> {item.name} </label> {/**Label associated with the checkbox */}
                                    </div>
                                    <div className="meal_cost">${item.cost}</div> {/**Cost of each meal item */}
                                </div>
                            ))}
                        </div>
                        <div className="total_cost">Total Cost: {mealsTotalCost}</div>


                        </div>
                    </div>
                    ) : (
                        /** TotalCost component receives the props totalCosts and ItemDisplay
                         * totalCosts: prop contains cost data and the ItemsDisplay() component with items
                         * is passed as props to the TotalCost component
                         */
                        <div className="total_amount_detail">
                            <TotalCost totalCosts={totalCosts} handleClick={handleToggleItems} ItemsDisplay={() => <ItemsDisplay items={items} />} />
                        </div>
                    )
                }

            </div>
        </>

    );
};

export default ConferenceEvent;
