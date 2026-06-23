export type RentalType = "villa" | "hotel" | "cottage" | "camping";

export const RENTAL_TYPES: {
  id: RentalType;
  label: string;
  emoji: string;
  propertyLabel: string;
  invoiceTitle: string;
  defaultItem: string;
  defaultPolicies: string;
}[] = [
  {
    id: "villa",
    label: "Villa",
    emoji: "🏡",
    propertyLabel: "Villa Name",
    invoiceTitle: "Villa Booking Invoice",
    defaultItem: "Villa Stay",
    defaultPolicies: `1. Guest count must not exceed the number declared at booking (extra charges apply).
2. No refunds for cancellations.
3. Noise must be minimized after 10 PM.
4. Guests must provide valid ID proof upon arrival.
5. Swimming pool timings: 9:00 AM – 11:00 PM.
6. Supervise children at all times in/around the pool.
7. No food/drinks in or around the pool area.
8. No pets allowed (violation incurs an extra security deposit).
9. Remaining balance must be paid at check-in strictly.
10. Refundable security deposit collected at check-in.
11. Drugs are strictly prohibited – violation will lead to immediate check-out.
12. No spitting or littering in the villa will be fined ₹1000/-.`,
  },
  {
    id: "hotel",
    label: "Hotel",
    emoji: "🏨",
    propertyLabel: "Hotel Name",
    invoiceTitle: "Hotel Stay Invoice",
    defaultItem: "Room Charges",
    defaultPolicies: `1. Check-in time: 2:00 PM | Check-out time: 11:00 AM.
2. Valid government ID required at check-in.
3. No refunds for early check-out.
4. Outside food and beverages not permitted.
5. Visitors not allowed in rooms after 10 PM.
6. Management is not responsible for loss of valuables.
7. Any damage to hotel property will be charged accordingly.
8. Remaining balance must be settled before check-out.`,
  },
  {
    id: "cottage",
    label: "Cottage",
    emoji: "🛖",
    propertyLabel: "Cottage Name",
    invoiceTitle: "Cottage Booking Invoice",
    defaultItem: "Cottage Stay",
    defaultPolicies: `1. Guest count must not exceed the declared number.
2. No refunds for cancellations within 48 hours.
3. Noise must be minimized after 10 PM.
4. Valid ID proof required upon arrival.
5. Guests are responsible for their belongings.
6. Refundable security deposit collected at check-in.
7. Any damage to property will be charged to guests.
8. Remaining balance must be paid at check-in.`,
  },
  {
    id: "camping",
    label: "Camping",
    emoji: "⛺",
    propertyLabel: "Camp Site Name",
    invoiceTitle: "Camping Invoice",
    defaultItem: "Camping Charges",
    defaultPolicies: `1. Follow all camp site rules and regulations.
2. No refunds for cancellations.
3. Campfire only in designated areas.
4. No loud music after 10 PM.
5. Carry out all trash — leave no trace.
6. Guests are responsible for their own safety.
7. Management not liable for accidents or injuries.
8. Remaining balance must be paid at check-in.`,
  },
];

export function getRentalType(id: RentalType) {
  return RENTAL_TYPES.find((r) => r.id === id)!;
}