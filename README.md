# DS440 CapStone
# Fake News Detector Application: Dalton Cymbalski and Evan Settipane

# Datasets used
#### We used the LIAR dataset as seen in the repo, as well as a kaggle dataset, "Fake News Detection Datasets" utilizing the Fake.csv and True.csv files. Link to kaggle: https://www.kaggle.com/datasets/emineyetm/fake-news-detection-datasets

## The enhanced2news.ipynb does not need to be used at all. It was used for our model training.

## How To (Using google colab and React)
### 1) Starting in colab:
#### -- You need to use the realbackend.ipynb from this repo
#### -- Also use the lstm_model.h5 and tokenizer.pkl from this repo
#### -- When you are in the notebook realbackend.ipynb put lstm_model.h5 and tokenizer.pkl into the notebook
#### -- Now you can run the notebook fully from top to bottom
#### -- When running the you will see an output and in it you will see something like: Your public API URL: NgrokTunnel: "https://CUSTOMLINK.ngrok-free.app"
#### -- You will need this part when in react: https://CUSTOMLINK.ngrok-free.app

### 2) React sandbox:
#### -- For this you will need the App.tsx, ResultCard.tsx, and tailwind.config.js files. Do not download them, you will just copy and paste them for react
#### -- Go to https://codesandbox.io/dashboard/recent?workspace=ws_8CyYYneNekUAQoieksB9Ub
#### -- You will have to create a react account if you do not have one already
#### -- When done, at the top right click the "create" button and choose "React + tailwind". You may need to look it up in the search bar
#### -- When in the sandbox in the workspace folders on the leftside you will see a "src" folder. Copy and paste the App.tsx from the repo into there, replacing what is in it. Then right click "src" and select "New File", naming it "ResultCard.tsx" and then copy and pasting everything from the repo into it. Finally, there is also a "tailwind.config.js" file on the left as well, copy and paste everything from the repo version into it.
#### -- The last step for it to fully work now is putting, https://CUSTOMLINK.ngrok-free.app from before in two seperate fetch areas in the App.tsx file. Put the link right before /analyze and /send-feedback. LOOKS LIKE THIS: 
    try {
      const response = await fetch(
        "https://58de-34-125-4-60.ngrok-free.app/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        }
      );
#### AND
    try {
      const response = await fetch(
        "https://58de-34-125-4-60.ngrok-free.app/send-feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ feedback }),
        }
      );

### 3) Everything should be good to go now
#### When submitting a url it will take the application a little time to run
#### Just put a url of a news article you want to check in the box and click submit
#### If you want to try the Submit Feedback box as well the realbackend code still needs to be running, just an FYI. Whatever feedback you send gets sent to an email we created for the project
