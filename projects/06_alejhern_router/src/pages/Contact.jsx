import { Link } from '../components/Link'
export default function Contact() {
  return (
    <>
      <h2>Contact Page</h2>
      <form action="">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" />
          <br />
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" />
          <br />
          <input type="submit" value="Submit" />
      </form>
      <Link to="/">Go to Home</Link>
    </>
  )
}