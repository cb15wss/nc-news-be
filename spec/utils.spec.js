process.env.NODE_ENV = "test";

const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns an empty array when passed an empty array", () => {
    expect(formatDates([])).to.eql([]);
  });
  it("returns 1 formatted date object in the array when passed 1 object in the array", () => {
    const arr = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const actual = formatDates(arr);
    const expected = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),
        votes: 100
      }
    ];
    expect(actual).to.eql(expected);
  });
  it("should not mutate original array", () => {
    const arr = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];

    const expected = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),
        votes: 100
      }
    ];
    expect(arr).not.to.eql(expected);
  });
  it("should maintain the other keys in the array objects", () => {
    const arr = [
      {
        title: "22 Amazing open source React projects",
        topic: "coding",
        author: "happyamy2016",
        body:
          "This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.",
        created_at: 1500659650346,
        votes: 10
      }
    ];
    const actual = formatDates(arr);
    const expected = [
      {
        title: "22 Amazing open source React projects",
        topic: "coding",
        author: "happyamy2016",
        body:
          "This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.",
        created_at: new Date(1500659650346),
        votes: 10
      }
    ];
    expect(actual).to.eql(expected);
  });
  it("formats multiple objects in the array", () => {
    const arr = [
      {
        title: "Who Will Manage Your Club in 2021?",
        topic: "football",
        author: "happyamy2016",
        body:
          "Managerial changes are too common in the modern day game. Already in the 16/17 season, we have seen 14 managers lose their job from the Premier League to League Two. Swansea’s Francesco Guidolin became the first top division manager to lose his job but already question marks are raised regarding the future of the likes of David Moyes and Mike Phelan.",
        created_at: 1472144905177,
        votes: 30
      },
      {
        title: "Why do England managers keep making the same mistakes?",
        topic: "football",
        author: "tickle122",
        body:
          "When Roy Hodgson resigned after this summer’s debacle, the England managerial merry go-round set into motion raising hopes that change would improve the nations fortunes.  In came Sam Allardyce but the same old squad was announced – apart from Michail Antonio – resulting in a similar type performance that was customary this summer. I was an advocate of Big Sam’s appointment because of the fact he managed down the league and could see that talent lay beyond just the big clubs in the country. Roy had many faults but the biggest frustration for me was he failed to utilise an already diminished pool of English players by continuing to pick the so called elite players – who are all tainted with failure. To be fair to Allardyce his first England game came so early in the season that it made making whole sale changes difficult. We shall never know if he would have picked different players. Since he left the job it was up to Gareth Southgate to take on the mantle and again hope arose that he may start to pick some of the talented under 21s that he has worked with over the last five years.",
        created_at: 1489429710045,
        votes: 40
      },
      {
        title: "History of FC Barcelona",
        topic: "football",
        author: "weegembump",
        body:
          "The history of Futbol Club Barcelona goes from the football club's founding in 1899 and up to current time. FC Barcelona, also known simply as Barcelona and familiarly as Barça, is based in Barcelona, Catalonia, Spain. The team was founded in 1899 by a group of Swiss, English and Spanish footballers led by Joan Gamper. The club played amateur football until 1910 in various regional competitions. In 1910, the club participated in their first of many European competitions, and has since amassed ten UEFA trophies and a sextuple. In 1928, Barcelona co-founded La Liga, the top-tier in Spanish football, along with a string of other clubs. As of 2016, Barcelona has never been relegated from La Liga, a record they share with Athletic Bilbao and arch-rival Real Madrid. The history of Barcelona has often been politically. Though it is a club created and run by foreigners, Barcelona gradually became a club associated with Catalan values. In Spain's transition to autocracy in 1925, Catalonia became increasingly hostile towards the central government in Madrid. The hostility enhanced Barcelona's image as a focal point for Catalonism, and when Francisco Franco banned the use of the Catalan language, the stadium of Barcelona became one of the few places the people could express their dissatisfaction. The Spanish transition to democracy in 1978 has not dampened the club's image of Catalan pride. In the 2000s – a period of sporting success in the club and an increased focus on Catalan players – club officials have openly called for Catalonia to become an independent state.",
        created_at: 1518899923448,
        votes: 50
      }
    ];
    const actual = formatDates(arr);
    const expected = [
      {
        title: "Who Will Manage Your Club in 2021?",
        topic: "football",
        author: "happyamy2016",
        body:
          "Managerial changes are too common in the modern day game. Already in the 16/17 season, we have seen 14 managers lose their job from the Premier League to League Two. Swansea’s Francesco Guidolin became the first top division manager to lose his job but already question marks are raised regarding the future of the likes of David Moyes and Mike Phelan.",
        created_at: new Date(1472144905177),
        votes: 30
      },
      {
        title: "Why do England managers keep making the same mistakes?",
        topic: "football",
        author: "tickle122",
        body:
          "When Roy Hodgson resigned after this summer’s debacle, the England managerial merry go-round set into motion raising hopes that change would improve the nations fortunes.  In came Sam Allardyce but the same old squad was announced – apart from Michail Antonio – resulting in a similar type performance that was customary this summer. I was an advocate of Big Sam’s appointment because of the fact he managed down the league and could see that talent lay beyond just the big clubs in the country. Roy had many faults but the biggest frustration for me was he failed to utilise an already diminished pool of English players by continuing to pick the so called elite players – who are all tainted with failure. To be fair to Allardyce his first England game came so early in the season that it made making whole sale changes difficult. We shall never know if he would have picked different players. Since he left the job it was up to Gareth Southgate to take on the mantle and again hope arose that he may start to pick some of the talented under 21s that he has worked with over the last five years.",
        created_at: new Date(1489429710045),
        votes: 40
      },
      {
        title: "History of FC Barcelona",
        topic: "football",
        author: "weegembump",
        body:
          "The history of Futbol Club Barcelona goes from the football club's founding in 1899 and up to current time. FC Barcelona, also known simply as Barcelona and familiarly as Barça, is based in Barcelona, Catalonia, Spain. The team was founded in 1899 by a group of Swiss, English and Spanish footballers led by Joan Gamper. The club played amateur football until 1910 in various regional competitions. In 1910, the club participated in their first of many European competitions, and has since amassed ten UEFA trophies and a sextuple. In 1928, Barcelona co-founded La Liga, the top-tier in Spanish football, along with a string of other clubs. As of 2016, Barcelona has never been relegated from La Liga, a record they share with Athletic Bilbao and arch-rival Real Madrid. The history of Barcelona has often been politically. Though it is a club created and run by foreigners, Barcelona gradually became a club associated with Catalan values. In Spain's transition to autocracy in 1925, Catalonia became increasingly hostile towards the central government in Madrid. The hostility enhanced Barcelona's image as a focal point for Catalonism, and when Francisco Franco banned the use of the Catalan language, the stadium of Barcelona became one of the few places the people could express their dissatisfaction. The Spanish transition to democracy in 1978 has not dampened the club's image of Catalan pride. In the 2000s – a period of sporting success in the club and an increased focus on Catalan players – club officials have openly called for Catalonia to become an independent state.",
        created_at: new Date(1518899923448),
        votes: 50
      }
    ];
    expect(actual).to.eql(expected);
  });
});

describe("makeRefObj", () => {
  it("returns an empty object when passed an empty array", () => {
    expect(makeRefObj([])).to.eql({});
  });
  it("returns 1 reference object when passed 1 object in the array", () => {
    const arr = [{ article_id: 1, title: "A" }];
    const actual = makeRefObj(arr);
    const expected = { A: 1 };
    expect(actual).to.eql(expected);
  });
  it("returns multiple formatted objects", () => {
    const arr = [
      { article_id: 1, title: "A" },
      { article_id: 6, title: "D" },
      { article_id: 10, title: "V" }
    ];
    const actual = makeRefObj(arr);
    const expected = { A: 1, D: 6, V: 10 };
    expect(actual).to.eql(expected);
  });
  it("should not mutate original object", () => {
    const arr = [{ article_id: 1, title: "A" }];
    const expected = { A: 1 };
    expect(arr[0]).not.to.eql(expected);
  });
});

describe("formatComments", () => {
  it("returns an empty array when passed an empty array", () => {
    expect(formatComments([])).to.eql([]);
  });
  it("returns 1 formatted comment when passed 1 object in the array and a reference object", () => {
    const arr = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        created_by: "tickle122",
        votes: -1,
        created_at: 1468087638932
      }
    ];
    const refObj = {
      "The People Tracking Every Touch, Pass And Tackle in the World Cup": 18
    };
    const actual = formatComments(arr, refObj);
    const expected = [
      {
        article_id: 18,
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        author: "tickle122",
        votes: -1,
        created_at: new Date(1468087638932)
      }
    ];
    expect(actual).to.eql(expected);
  });
  it("should not mutate original array", () => {
    const arr = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        created_by: "tickle122",
        votes: -1,
        created_at: 1468087638932
      }
    ];
    const refObj = {
      "The People Tracking Every Touch, Pass And Tackle in the World Cup": 18
    };
    const actual = formatComments(arr, refObj);
    const expected = [
      {
        article_id: 18,
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        author: "tickle122",
        votes: -1,
        created_at: new Date(1468087638932)
      }
    ];
    expect(arr).not.to.eql(expected);
  });
  it("returns multiple formatted comments in the array", () => {
    const arr = [
      {
        body:
          "Rerum voluptatem quam odio facilis quis illo unde. Ex blanditiis optio tenetur sunt. Cumque dolor ducimus et qui officia quasi non illum reiciendis.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        created_by: "happyamy2016",
        votes: 4,
        created_at: 1467709215383
      },
      {
        body:
          "Quod qui quia dignissimos sit tempore vel reprehenderit. Ipsa ipsa veritatis architecto corporis et et non. Sed alias occaecati eum dignissimos sint eius. Ad ea iste quas quia velit libero voluptatem voluptatem. Animi illo nisi nulla quia sapiente omnis dolorem nulla. Sunt dolor similique.",
        belongs_to: "Which current Premier League manager was the best player?",
        created_by: "weegembump",
        votes: -5,
        created_at: 1496231984183
      },
      {
        body:
          "Veritatis animi et voluptates nesciunt officia facere eaque. Eligendi earum explicabo necessitatibus aut dolorem nisi esse nesciunt. Non iusto rem ut consequuntur quam ut rem sed. Velit laboriosam consectetur enim delectus eos sit veritatis eveniet perspiciatis.",
        belongs_to: "Stone Soup",
        created_by: "grumpy19",
        votes: -5,
        created_at: 1469442270839
      }
    ];
    const expected = [
      {
        article_id: 18,
        body:
          "Rerum voluptatem quam odio facilis quis illo unde. Ex blanditiis optio tenetur sunt. Cumque dolor ducimus et qui officia quasi non illum reiciendis.",
        author: "happyamy2016",
        votes: 4,
        created_at: new Date(1467709215383)
      },
      {
        article_id: 17,
        body:
          "Quod qui quia dignissimos sit tempore vel reprehenderit. Ipsa ipsa veritatis architecto corporis et et non. Sed alias occaecati eum dignissimos sint eius. Ad ea iste quas quia velit libero voluptatem voluptatem. Animi illo nisi nulla quia sapiente omnis dolorem nulla. Sunt dolor similique.",
        author: "weegembump",
        votes: -5,
        created_at: new Date(1496231984183)
      },
      {
        article_id: 35,
        body:
          "Veritatis animi et voluptates nesciunt officia facere eaque. Eligendi earum explicabo necessitatibus aut dolorem nisi esse nesciunt. Non iusto rem ut consequuntur quam ut rem sed. Velit laboriosam consectetur enim delectus eos sit veritatis eveniet perspiciatis.",
        author: "grumpy19",
        votes: -5,
        created_at: new Date(1469442270839)
      }
    ];
    const refObj = {
      "The People Tracking Every Touch, Pass And Tackle in the World Cup": 18,
      "Which current Premier League manager was the best player?": 17,
      "Stone Soup": 35
    };
    const actual = formatComments(arr, refObj);
    expect(actual).to.eql(expected);
  });
});
