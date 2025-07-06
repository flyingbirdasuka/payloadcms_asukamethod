import { BookingForm } from "./booking-form";

export default async function BookingPage() {
  return (
    <main className="container">
      <h1 className="text-3xl font-bold mb-6">Book Your Class</h1>
      <BookingForm />
    </main>
  )
}