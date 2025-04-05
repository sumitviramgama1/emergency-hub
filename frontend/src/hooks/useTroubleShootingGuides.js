import { useState } from 'react';

export const useTroubleshootingGuides = () => {
  const [guides] = useState([
    {
      id: 1,
      title: "How to Change a Flat Tire",
      description: "Step-by-step guide with visuals",
      content: "1. Find a safe location to park\n2. Locate spare tire and tools\n3. Loosen lug nuts\n4. Jack up the vehicle\n5. Remove lug nuts and tire\n6. Install spare tire\n7. Lower vehicle and tighten lug nuts\n8. Check tire pressure",
      category: "roadside" // Added category
    },
    {
      id: 2,
      title: "Jump Starting Your Battery",
      description: "Quick guide to safely jump start your car",
      content: "1. Position vehicles close together\n2. Turn off both vehicles\n3. Connect positive cable to dead battery\n4. Connect other end to good battery\n5. Connect negative cable to good battery\n6. Connect other end to metal ground on dead car\n7. Start good vehicle\n8. Start dead vehicle\n9. Remove cables in reverse order",
      category: "roadside" // Added category
    },
    {
      id: 3,
      title: "Engine Overheating",
      description: "What to do when your engine overheats",
      content: "1. Turn off A/C and turn on heater\n2. Pull over and turn off engine\n3. Wait for engine to cool\n4. Check coolant level\n5. Look for leaks\n6. Add coolant if needed\n7. Drive to service station if safe",
      category: "roadside" // Added category
    },
    {
      id: 4,
      title: "Car Won't Start",
      description: "Troubleshooting common starting issues",
      content: "1. Check if dashboard lights turn on\n2. If no lights, check battery connections\n3. If lights on but no start, listen for click\n4. If clicking, likely starter motor issue\n5. If no click, could be ignition switch\n6. If engine cranks but won't start, check fuel or spark issues",
      category: "roadside" // Added category
    },
    // New Medical Emergency Guides
    {
      id: 5,
      title: "CPR (Cardiopulmonary Resuscitation)",
      description: "Step-by-step guide to perform CPR",
      content: "1. Check for responsiveness\n2. Call for emergency help\n3. Place the person on their back\n4. Perform chest compressions (30 compressions at 2 inches deep)\n5. Give 2 rescue breaths\n6. Continue cycles of 30 compressions and 2 breaths until help arrives",
      category: "medical" // Added category
    },
    {
      id: 6,
      title: "Choking - Heimlich Maneuver",
      description: "How to help someone who is choking",
      content: "1. Stand behind the person and wrap your arms around their waist\n2. Make a fist with one hand and place it above the navel\n3. Grasp your fist with the other hand and perform quick upward thrusts\n4. Repeat until the object is dislodged",
      category: "medical" // Added category
    },
    {
      id: 7,
      title: "Severe Bleeding",
      description: "How to control severe bleeding",
      content: "1. Apply direct pressure to the wound with a clean cloth or bandage\n2. Elevate the injured area if possible\n3. If bleeding doesn't stop, apply pressure to the nearest artery\n4. Keep the person calm and warm\n5. Seek immediate medical help",
      category: "medical" // Added category
    },
    {
      id: 8,
      title: "Heart Attack - First Aid",
      description: "What to do if someone is having a heart attack",
      content: "1. Call emergency services immediately\n2. Have the person sit down and rest\n3. Loosen tight clothing\n4. If the person is conscious, give them aspirin (if not allergic)\n5. Monitor the person and be prepared to perform CPR if necessary",
      category: "medical" // Added category
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