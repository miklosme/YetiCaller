var quotes = [
  "“God created war so that Americans would learn geography.” ― Mark Twain",
  "“War is what happens when language fails.” ― Margaret Atwood",
  "“War is peace. Freedom is slavery. Ignorance is strength.” ― George Orwell,          1984",
  "“I know not with what weapons World War III will be fought, but World War IV will be fought with sticks and stones.” ― Albert Einstein",
  "“The true soldier fights not because he hates what is in front of him, but because he loves what is behind him.” ― G.K. Chesterton",
  "“It is forbidden to kill; therefore all murderers are punished unless they kill in large numbers and to the sound of trumpets.” ― Voltaire",
  "“Older men declare war. But it is youth that must fight and die.” ― Herbert Hoover",
  "“There are causes worth dying for, but none worth killing for.” ― Albert Camus",
  "“Only the dead have seen the end of war.” ― Plato",
  "“If you win, you need not have to explain... If you lose, you should not be there to explain!” ― Adolf Hitler",
  "“A small but noteworthy note. I've seen so many young men over the years who think they're running at other young men. They are not. They are running at me.” ― Markus Zusak,          The Book Thief",
  "“Appear weak when you are strong, and strong when you are weak.” ― Sun Tzu,          The Art of War",
  "“Never think that war, no matter how necessary, nor how justified, is not a crime.” ― Ernest Hemingway",
  "“Listen up - there's no war that will end all wars.” ― Haruki Murakami,          Kafka on the Shore",
  "“What difference does it make to the dead, the orphans and the homeless, whether the mad destruction is wrought under the name of totalitarianism or in the holy name of liberty or democracy?” ― Mahatma Gandhi",
  "“The supreme art of war is to subdue the enemy without fighting.” ― Sun Tzu,          The Art of War",
  "“All war is a symptom of man's failure as a thinking animal.” ― John Steinbeck",
  "“War does not determine who is right - only who is left.” ― Bertrand Russell",
  "“There is no flag large enough to cover the shame of killing innocent people.” ― Howard Zinn",
  "“Dad, how do soldiers killing each other solve the world's problems?” ― Bill Watterson,          Calvin and Hobbes: Sunday Pages 1985-1995",
  "“It's hard to lead a cavalry charge if you think you look funny on a horse.” ― Adlai E. Stevenson II",
  "“Sometimes you have to pick the gun up to put the Gun down.” ― Malcolm X",
  "“War is over ... If you want it.” ― John Lennon",
  "“The world is full enough of hurts and mischances without wars to multiply them.” ― J.R.R. Tolkien,          The Return of the King",
  "“They're in love.  Fuck the war.” ― Thomas Pynchon,          Gravity's Rainbow",
  "“When the rich wage war it's the poor who die.” ― Jean-Paul Sartre,          Le diable et le bon dieu",
  "“Háború lesz, és én nyerem meg!” ― Simicska Lajos"
];

Template.registerHelper("getQuoteAboutWar", function () {
    return quotes[ Math.floor(Math.random() * quotes.length) ];
});