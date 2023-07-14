const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override')
const createError = require('http-errors');
const mongdb = require('./src/config/mongdb/index');
const router = require('./src/router/main.route');
const session = require('express-session');
const store = session.MemoryStore();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const _User = require('./src/models/users.model');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

app.use(methodOverride('_method'));



app.use(session({
  saveUninitialized: false,
  secret: "matkhau",
  resave:false,
  cookie: {
    secure: false,
    maxAge: 1000*60*60,
    // rolling: false
  },
  store,
}))

app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());
// veryfy.login();

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  async function(username, password, done) {
    try {
      const user = await _User.findOne({email: username, password: password})
    if(!user){
      done(null, false);
    }else{
      done(null, user)
    }
    } catch (error) {
      console.log(error);
      next(error);
    }
    
    }
  ));


passport.use(new GoogleStrategy({
    clientID: '912081908877-bb97e119gan8e7mqmrpj1ikpkrv7ktan.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "/account/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
  const existingUser = await _User.findOne({ googleID: profile.id });
  if (existingUser) {
    return done(null, existingUser);
  }

  if (!existingUser) {
  
    const user = await new _User({
      role_id: '645bee4e320c6a77c0731caf',
      googleID: profile.id,
      email: profile.emails[0].value,
      fullname: profile.displayName,
    }).save()

    return done(null, user)
  }
  }
));

passport.serializeUser((user, done)=>{
  done(null, user.id);
})

passport.deserializeUser(async (id, done)=>{
  const user = await _User.findOne({_id: id})
  if(!user){
    return done(null, false);
  }else{
    return done(null, user);
  }
})

mongdb.connect();
app.set('view engine', 'ejs');
app.use(express.urlencoded({
    extended: true
  }));
app.use(express.json());

app.use(express.static(
    path.join(__dirname, 'src','public')));
    app.set('views', path.join(__dirname, 'src', 'views'));

    app.use((req, res, next) => {
      if (req.url === '/favicon.ico') {
        // Chuyển hướng yêu cầu favicon.ico
        res.status(204).end();
      } else {
        // Tiếp tục xử lý các yêu cầu khác
        next();
      }
    });

router(app);

//error Handling Middleware called
app.use((req, res, next) => {
  // const error = new Error("Not found");
  // error.status = 404;
  next(createError(404, "Not found"));
});

//error handler Middleware 
app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || 'Internal Server Error'
    }
  })
});

app.listen(8888);