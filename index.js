const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const listStudents = [];

function questionAsync(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function askQuestions() {
    let option;

    option = await questionAsync(
        '1. Nhập thêm sinh viên mới\n' +
        '2. Hiển thị dánh sách sinh viên \n' +
        '3. Tìm kiếm sinh viên theo tên \n' +
        '4. Thoát chương trình \n' +
        '\nLựa chọn của bạn:  ');

    switch (parseInt(option)) {
        case 1:
            await addStudent();
            break;
        case 2:
            await viewListStudent();
            break;
        case 3:
            await searchStudentByName();
            break;
        case 4:
            return
        default:
            console.log('Lựa chọn không hợp lệ. Vui lòng chọn lại.');
            break;
    }

    const answer = await questionAsync('\nBạn có muốn tiếp tục không? Nếu có nhập Y, ngược lại nhấn phím bất kỳ để thoát: ');
    return answer.toLowerCase() === 'y';
}

async function addStudent() {
    const student = {};
    student.name = await questionAsync('Tên: ');
    student.age = await questionAsync('Tuổi: ');
    student.title = await questionAsync('Title: ');

    listStudents.push(student);

    const answer = await questionAsync('\nBạn có muốn tiếp tục thêm sinh viên khác không? Nếu có nhập Y, ngược lại nhấn phím bất kỳ để thoát: ');

    return answer.toLowerCase() === 'y' ? addStudent() : writeFile2(listStudents);
}

async function viewListStudent() {

    const data = await listData();
    console.log('Danh sách sinh viên: \n');
    data.forEach((item) => {
        console.log('Tên: ' + item.name +', Tuổi:' + item.age + ', Title:' +item.title);
    })
}

async function listData() {
    try {
        const data = await fs.readFile(path.resolve('./text2.txt'), { encoding: 'utf8' });
        const students = data.split('\n').filter(Boolean).map(studentString => {
            const [name, age, title] = studentString.split(',');
            return { name, age, title };
        });

        return students;
    } catch (error) {
        console.error(error);
    }
}

async function searchStudentByName() {
    let name = await questionAsync('Tên cần tìm: ');
    const data = await listData();
    const foundStudents = data.filter(student => student.name.toLowerCase() === name.toLowerCase());

    if (foundStudents.length === 0) {
        console.log('Không tìm thấy sinh viên có tên là', name);
    } else {
        console.log('\nSinh viên có tên', name, 'được tìm thấy:');
        foundStudents.forEach((student, index) => {
            console.log(`#${index + 1}: Tên: ${student.name}, tuổi:${student.age}, title: ${student.title}`);
        });
    }
}

async function main() {
    let isContinue = true;

    while (isContinue) {
        isContinue = await askQuestions();
    }

    rl.close();
}

async function writeFile2(listStudents) {
    try {
        await fs.writeFile('text2.txt', listStudents.map(x => {
            return x.name + ',' + x.age + ',' + x.title + '\n';
        }));
    } catch (error) {
        console.error('Error writing to file:', error);
    }
}

main();


