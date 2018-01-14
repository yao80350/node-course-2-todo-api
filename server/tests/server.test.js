const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

beforeEach((done) => {
  Todo.remove({}).then(() => done()); // 移除数据库todos的所有数据
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Test todo text';

    request(app)
      .post('/todos') //这里的post和server.js的app.post性质一样
      .send({text}) //send string, supertest 会自动将obj转换成string，同上
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.find().then((todos) => { //Todo是todo.js内定义model('todos')
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err,res) => {
        if(err) {
          return done(err);
        }

        Todo.find().then((todos) =>{
          expect(todos.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
