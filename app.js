function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const app = Vue.createApp({
  data() {
    return {
      monsterHealth: 100,
      playerHealth: 100,
      currentRound: 0,
      winner: null,
      logMessages: [],
    };
  },

  computed: {
    monsterBarStyles() {
      if (this.monsterHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHealth + "%" };
    },
    playerBarStyles() {
      if (this.playerHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
  },

  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "monster";
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "player";
      }
    },
    // winner() {
    //   if (value === "player") {
    //     this.monsterHealth = 0;
    //     this.addLogMessage(this.playerName, "win", "");
    //   } else if (value === "monster") {
    //     this.playerHealth = 0;
    //     this.addLogMessage("monster", "win", "");
    //   } else if (value === "draw") {
    //     this.playerHealth = 0;
    //     this.monsterHealth = 0;
    //     //this.addLogMessage("monster", "loss", "");
    //     //this.addLogMessage(this.playerName, "loss", "");
    //   }
    // },
    // currentRound(value) {
    //   if (value > 0 && !this.playerName.trim()) {
    //     this.playerName = "Player";
    //   }
    // },

  },

  methods: {
    restartGame() {
      this.winner = null;
      this.monsterHealth = 100;
      this.playerHealth = 100;
      this.currentRound = 0;
      //this.logMessage = [];
    },
    attackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(5, 10);
      this.monsterHealth -= attackValue;
      this.addLogMessages("player", "attack", attackValue);
      this.attackPlayer(); // 因为攻击之后要换对方攻击，所以call对方
    },
    attackPlayer() {
      // 不需要改变回合数，因为这里仍是同一回合
      const attackValue = getRandomValue(5, 10);
      this.playerHealth -= attackValue;
      this.addLogMessages("monster", "attack", attackValue);
    },
    specialAttack() {
      this.currentRound++;
      const attackValue = getRandomValue(10, 25);
      this.monsterHealth -= attackValue;
      this.addLogMessages("player", "special-attack", attackValue);
      this.attackPlayer();
    },
    healPlayer() {
      this.currentRound++;
      const healValue = getRandomValue(8, 20);
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }
      this.addLogMessages("player", "heal", healValue);
      this.attackPlayer;
    },
    surrenderPlayer() {
      this.winner = "monster";
    },
    surrender(){
      this.winner = 'monster';
    },

    addLogMessages(who, what, value) {
      this.logMessages.unshift({
        // debug的时候发现这里写错了，property应该在括号里面
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
    /*
    stylePlayer(log) {
			return {
				'log--player': log.actionBy === 'player',
				'log--monster': log.actionBy === 'monster',
			};
		},
    */
  },
});

app.mount("#game"); // 不要用const vm
