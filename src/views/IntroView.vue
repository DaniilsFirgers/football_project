<template>
  <div class="main-component">
    <div class="info">
      <h1>
        Welcome to the Lielās Futbola Līgas (LFL) webpage created by Daniils
        Firgers
      </h1>
      <h2 class="assignment-info">Student number - df18001</h2>

      <div class="stack">
        <h2>Technologies used:</h2>
        <ul class="stack-list">
          <li>Python</li>
          <li>Javascript</li>
          <li>Typescript</li>
          <li>Vue JS</li>
          <li>Node JS</li>
          <li>HTML + CSS</li>
          <li>MongoDB</li>
        </ul>
      </div>
      <h3 class="assignment-info">
        Statistics covered: overall team standings, player violations, scoring.
      </h3>
    </div>
  </div>
</template>

<script></script>

<style scoped>
.assignment-info {
  margin-top: 10px;
  color: black;
}
.stack-list {
  color: black;
  margin-left: 30px;
}
.stack {
  margin-top: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.info {
  margin-top: 50px;
  width: 60vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.main-component {
  background-color: #afe1af;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  justify-content: flex-start;
  color: white;
}
</style>
