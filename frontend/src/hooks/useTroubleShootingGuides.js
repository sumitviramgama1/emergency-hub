import { useState } from 'react';

export const useTroubleshootingGuides = () => {
  const [guides] = useState([
    {
      id: 1,
      title: "How to Change a Flat Tire",
      description: "Step-by-step guide with visuals",
      content: "1. Find a safe location to park\n2. Locate spare tire and tools\n3. Loosen lug nuts\n4. Jack up the vehicle\n5. Remove lug nuts and tire\n6. Install spare tire\n7. Lower vehicle and tighten lug nuts\n8. Check tire pressure",
      category: "roadside"
    },
    {
      id: 2,
      title: "Jump Starting Your Battery",
      description: "Quick guide to safely jump start your car",
      content: "1. Position vehicles close together\n2. Turn off both vehicles\n3. Connect positive cable to dead battery\n4. Connect other end to good battery\n5. Connect negative cable to good battery\n6. Connect other end to metal ground on dead car\n7. Start good vehicle\n8. Start dead vehicle\n9. Remove cables in reverse order",
      category: "roadside"
    },
    {
      id: 3,
      title: "Engine Overheating",
      description: "What to do when your engine overheats",
      content: "1. Turn off A/C and turn on heater\n2. Pull over and turn off engine\n3. Wait for engine to cool\n4. Check coolant level\n5. Look for leaks\n6. Add coolant if needed\n7. Drive to service station if safe",
      category: "roadside"
    },
    {
      id: 4,
      title: "Car Won't Start",
      description: "Troubleshooting common starting issues",
      content: "1. Check if dashboard lights turn on\n2. If no lights, check battery connections\n3. If lights on but no start, listen for click\n4. If clicking, likely starter motor issue\n5. If no click, could be ignition switch\n6. If engine cranks but won't start, check fuel or spark issues",
      category: "roadside"
    },
    // Medical Emergency Guides
    {
      id: 5,
      title: "CPR (Cardiopulmonary Resuscitation)",
      description: "Step-by-step guide to perform CPR",
      content: "1. Check for responsiveness\n2. Call for emergency help\n3. Place the person on their back\n4. Perform chest compressions (30 compressions at 2 inches deep)\n5. Give 2 rescue breaths\n6. Continue cycles of 30 compressions and 2 breaths until help arrives",
      category: "medical"
    },
    {
      id: 6,
      title: "Choking - Heimlich Maneuver",
      description: "How to help someone who is choking",
      content: "1. Stand behind the person and wrap your arms around their waist\n2. Make a fist with one hand and place it above the navel\n3. Grasp your fist with the other hand and perform quick upward thrusts\n4. Repeat until the object is dislodged",
      category: "medical"
    },
    {
      id: 7,
      title: "Severe Bleeding",
      description: "How to control severe bleeding",
      content: "1. Apply direct pressure to the wound with a clean cloth or bandage\n2. Elevate the injured area if possible\n3. If bleeding doesn't stop, apply pressure to the nearest artery\n4. Keep the person calm and warm\n5. Seek immediate medical help",
      category: "medical"
    },
    {
      id: 8,
      title: "Heart Attack - First Aid",
      description: "What to do if someone is having a heart attack",
      content: "1. Call emergency services immediately\n2. Have the person sit down and rest\n3. Loosen tight clothing\n4. If the person is conscious, give them aspirin (if not allergic)\n5. Monitor the person and be prepared to perform CPR if necessary",
      category: "medical"
    },
    // Fuel Emergency Guides
    {
      id: 9,
      title: "Ran Out of Fuel",
      description: "What to do when your vehicle runs out of fuel",
      content: "1. Pull over to a safe location\n2. Turn on hazard lights\n3. Call for roadside assistance\n4. If close to a gas station, walk to get a gas can\n5. Return with at least 1 gallon of fuel\n6. Pour fuel into tank\n7. Start engine and drive to nearest gas station",
      category: "fuel"
    },
    {
      id: 10,
      title: "Fuel Gauge Not Working",
      description: "How to estimate remaining fuel when gauge fails",
      content: "1. Reset trip odometer when you fill up\n2. Know your vehicle's average mpg and tank size\n3. Calculate remaining range (trip miles ÷ mpg × tank size)\n4. Keep track of miles driven since last fill-up\n5. Fill up more frequently until gauge is repaired\n6. Have gauge checked by mechanic at earliest opportunity",
      category: "fuel"
    },
    {
      id: 11,
      title: "Wrong Fuel Type Used",
      description: "What to do if you put the wrong fuel in your vehicle",
      content: "1. DO NOT start the engine if you haven't already\n2. Inform gas station attendant\n3. Put vehicle in neutral\n4. Push to safe location if possible\n5. Call a tow truck or professional service\n6. Have fuel tank drained completely\n7. Have fuel system flushed before adding correct fuel",
      category: "fuel"
    },
    {
      id: 12,
      title: "Fuel Leak Detection",
      description: "How to identify and handle a fuel leak",
      content: "1. Look for puddles or wet spots under vehicle\n2. Check for strong fuel odor\n3. Watch for unexplained decrease in fuel level\n4. If leak detected, do not start engine\n5. Don't smoke or use open flames near vehicle\n6. Call for tow to repair shop\n7. For major leaks, move away from vehicle and call emergency services",
      category: "fuel"
    }
  ]);

  const [selectedGuide, setSelectedGuide] = useState(null);

  const openGuide = (guideId) => {
    const guide = guides.find(g => g.id === guideId);
    setSelectedGuide(guide);
  };

  const closeGuide = () => {
    setSelectedGuide(null);
  };

  return {
    guides,
    selectedGuide,
    openGuide,
    closeGuide
  };
};