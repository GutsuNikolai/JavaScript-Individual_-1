//Prev. Для анализа даты используется "Date" поэтому можно вводить раными способами, например yyyy-mm-dd

// Модуль для работы с файлами 
const fs = require('fs');

class TransactionAnalyzer {
    constructor(transactions) {
        this.transactions = transactions;
    }

    // Метод для добавления новой транзакции
    addTransaction(newTransaction) {
        this.transactions.push(newTransaction);
    }

    // Метод для получения списка всех транзакций
    getAllTransactions() {
        return this.transactions;
    }

    // Метод для получения массива уникальных типов транзакций
    getUniqueTransactionType() {
        // Создаем Set для хранения уникальных типов транзакций(и отбора уникальных)
        const uniqueTypes = new Set();
        this.transactions.forEach(transaction => {
            uniqueTypes.add(transaction.transaction_type);
        });
        // Вовзвращаю Set как массив
        return Array.from(uniqueTypes);
    }
    calculateTotalAmount() {
        let totalForAllTime = 0;
        for (let i = 0; i < analyzer["transactions"].length;i++){
            totalForAllTime += parseFloat(analyzer["transactions"][i]["transaction_amount"])
        }
        return totalForAllTime;
    }

    // Метод для расчета общей суммы транзакций за указанную дату
    calculateTotalAmountByDate(year, month, day) {
        // Валидация даты
        if (month < 1 || month > 12 || day < 1 || day > 31) {
            console.error('Неправильно введена дата.');
            return 0;
        }
        const isSameDate = (transactionDate, targetDate) => {
            return (!year || transactionDate.getFullYear() === year) &&
                   (!month || transactionDate.getMonth() === month - 1) &&
                   (!day || transactionDate.getDate() === day);
        };

        let totalAmount = 0;
        // Перебор всех транзакций и выбор соответствующих
        this.transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.transaction_date);
            if (isSameDate(transactionDate, new Date(year, month - 1, day))) {
                totalAmount += parseFloat(transaction.transaction_amount);
            }
        });
        return totalAmount;
    }
    // Метод для получения транзакций указанного типа (debitcredit)
    getTransactionsByType(type) {
        return this.transactions.filter(transaction => transaction.transaction_type === type);
    }
     // Метод для получения транзакций в указанном диапазоне дат
     getTransactionsInDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return this.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.transaction_date);
            return transactionDate >= start && transactionDate <= end;
        });
    }
    // Метод для получения транзакций с Торгашем(to edit) или Компанией
    getTransactionsByMerchant(merchantName) {
        return this.transactions.filter(transaction => transaction.merchant_name === merchantName);
    }
    calculateAverageTransactionAmount() {
        if (this.transactions.length === 0) {
            return 0;
        }
        const totalAmount = this.transactions.reduce((accumulator, transaction) => {
            return accumulator + parseFloat(transaction.transaction_amount);
        }, 0);
        return totalAmount / this.transactions.length;
    }
    // Метод для получения транзакций с опредленной суммой
    getTransactionsByAmountRange(minAmount, maxAmount) {
        return this.transactions.filter(transaction => {
            const amount = parseFloat(transaction.transaction_amount);
            return amount >= minAmount && amount <= maxAmount;
        });
    }

    // Метод для вычисления общей суммы дебетов
    calculateTotalDebitAmount() {
        return this.transactions.reduce((total, transaction) => {
            if (transaction.transaction_type === 'debit') {
                return total + parseFloat(transaction.transaction_amount);
            }
            return total;
        }, 0);
    }

    // Метод для нахождения месяца с наибольшим количеством транзакций
    findMostTransactionsMonth() {
        const transactionCountByMonth = {};
        // Перебор всех транзакций для каждого месяца
        this.transactions.forEach(transaction => {
            const month = new Date(transaction.transaction_date).getMonth();
            if (!transactionCountByMonth[month]) {
                transactionCountByMonth[month] = 0;
            }
            transactionCountByMonth[month]++;
        });
        // Выборка наипродуктивнейшего (вроде так пишется) месяца
        let mostTransactionsMonth = null;
        let maxTransactionCount = 0;
        for (const month in transactionCountByMonth) {
            if (transactionCountByMonth[month] > maxTransactionCount) {
                maxTransactionCount = transactionCountByMonth[month];
                mostTransactionsMonth = month;
            }
        }
        return (parseInt(mostTransactionsMonth)+1);
    }

    // Метод для нахождения месяца с наибольшим количеством дебетов
    findMostDebitTransactionMonth() {
        const debitTransactionCountByMonth = {};
            // Проход и перебор
            this.transactions.forEach(transaction => {
            if (transaction.transaction_type === 'debit') {
                const month = new Date(transaction.transaction_date).getMonth();
                if (!debitTransactionCountByMonth[month]) {
                    debitTransactionCountByMonth[month] = 0;
                }
                debitTransactionCountByMonth[month]++;
            }
        });
        
        // Находим месяц с наибольшим количеством дебетовых транзакций(+1,чтоб не начинать с 0-го(январь- первый месяц))
        let mostDebitTransactionMonth = null;
        let maxDebitTransactionCount = 0;
        for (const month in debitTransactionCountByMonth) {
            if (debitTransactionCountByMonth[month] > maxDebitTransactionCount) {
                maxDebitTransactionCount = debitTransactionCountByMonth[month];
                mostDebitTransactionMonth = month;
            }
        }
        return (parseInt(mostDebitTransactionMonth)+1) ;
    }
    // А ээто метод для проверки нахождения чаще проводимой транзакции 
    mostTransactionTypes() {
        // Подсчет количества дебетовых/кредетовых транзакций
        let debitCount = 0;
        let creditCount = 0;
        this.transactions.forEach(transaction => {
            if (transaction.transaction_type === 'debit') {
                debitCount++;
            } else if (transaction.transaction_type === 'credit') {
                creditCount++;
            }
        });

        if (debitCount > creditCount) {
            return 'debit';
        } else if (creditCount > debitCount) {
            return 'credit';
        } else {
            return 'equal';
        }
    }

    // Метод для получения транзакций, совершенных до указанной даты
    getTransactionsBeforeDate(date) {
        const targetDate = new Date(date);
        return this.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.transaction_date);
            return transactionDate < targetDate;
        });
    }

    // Метод для поиска транзакции по ее id
    findTransactionById(id) {
        return this.transactions.find(transaction => transaction.transaction_id === id);
    }

    // Метод для создания  массива с описаниями транзакций
    mapTransactionDescriptions() {
        return this.transactions.map(transaction => transaction.transaction_description);
    }

}

// Считывание данных с файла
function readTransactionsFromFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading transactions file:', error);
        return [];
    }
}

// Создание объекта с транзациями 
const transactionsData = readTransactionsFromFile('transactions.json');
const analyzer = new TransactionAnalyzer(transactionsData);

//  Добавляю каждой транзакции метод "string" 
analyzer.transactions.forEach(transaction => {
    transaction.string = function() {
        return JSON.stringify(this);
    };
});

// Analizing. Пример работы каждого метода
// console.log(analyzer.getUniqueTransactionType());
// console.log(analyzer.calculateTotalAmountByDate(2019,2,29));
// console.log(analyzer.calculateTotalAmountByDate(2019,1,14));
// console.log(analyzer.getTransactionsByType("debit"));
// console.log(analyzer.getTransactionsByMerchant("SuperMart"));
// console.log(analyzer.getTransactionsInDateRange("2019-01-01","2019-01-02"));
// console.log(analyzer.calculateAverageTransactionAmount());
// console.log(analyzer.getTransactionsByAmountRange(100,100));
// console.log(analyzer.calculateTotalDebitAmount());
// console.log(analyzer.findMostTransactionsMonth());
// console.log(analyzer.findMostDebitTransactionMonth());
// console.log(analyzer.mostTransactionTypes());
// console.log(analyzer.getTransactionsBeforeDate("2019-1-2"));
// console.log(analyzer.findTransactionById("1"));
// console.log(analyzer.mapTransactionDescriptions());



// Control questions:
/*1. Какие примитивные типы данных существуют в JavaScript?
2. Какие методы массивов вы использовали для обработки и анализа данных в вашем приложении, и как они помогли в
   выполнении задачи?
3. В чем состоит роль конструктора класса?
4. Каким образом вы можете создать новый экземпляр класса в JavaScript?

1: number,string,boolean,simbol,nulыl,undefined
2: Мною были использованы следующие методы:
        forEach(): для выполнения операций над каждым элементом 
        filter():  для фильтрации  на основе заданного условия
        map(): для создания массива с новыми значениями
        reduce(): для вычисления необходимого значения на основе значения элементов массива
        find(): для поиска нужного элемента
        push(): для добавления нового элемента
3: Роль конструктора класса заключается в создании новых экземпляров (объектов)  класса.
4: Экзэмпляр класса можно создать с использованием ключевог слова "new"
*/