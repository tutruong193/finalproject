import React from "react";
import cbum from "../../assets/cbum.jpg";
const LoginPage = () => {
  return (
    <div className="body">
      <div className="container-login">
        <div className="login">
          <form>
            <h1>Login</h1>
            <hr />
            <p>Explore the World!</p>
            <label>Email</label>
            <input type="text" placeholder="abc@exampl.com" />
            <label>Password</label>
            <input type="password" placeholder="enter your password!" />
            <button>Submit</button>
            <p>
              <a href="#">Forgot Password?</a>
            </p>
          </form>
        </div>
        <div class="pic">
          <img src={ cbum } />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
