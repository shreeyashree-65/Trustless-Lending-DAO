// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TrustlessLendingDAO {
    uint public loanCount;

    struct Loan {
        address payable borrower;
        address payable lender;
        uint amount;
        uint repayAmount;
        uint deadline;
        bool isFunded;
        bool isRepaid;
    }

    mapping(uint => Loan) public loans;

    event LoanRequested(uint loanId, address borrower, uint amount, uint repayAmount, uint deadline);
    event LoanFunded(uint loanId, address lender);
    event LoanRepaid(uint loanId, address borrower);
    event LoanDefaulted(uint loanId, address borrower);

    modifier onlyBorrower(uint _id) {
        require(msg.sender == loans[_id].borrower, "Not borrower");
        _;
    }

    modifier onlyLender(uint _id) {
        require(msg.sender == loans[_id].lender, "Not lender");
        _;
    }

    function requestLoan(uint _amount, uint _repayAmount, uint _duration) external {
        require(_repayAmount > _amount, "Repay must be greater than loan");
        require(_duration > 0, "Duration must be positive");

        loanCount++;
        loans[loanCount] = Loan({
            borrower: payable(msg.sender),
            lender: payable(address(0)),
            amount: _amount,
            repayAmount: _repayAmount,
            deadline: block.timestamp + _duration,
            isFunded: false,
            isRepaid: false
        });

        emit LoanRequested(loanCount, msg.sender, _amount, _repayAmount, block.timestamp + _duration);
    }

    function fundLoan(uint _id) external payable {
        Loan storage loan = loans[_id];
        require(!loan.isFunded, "Already funded");
        require(msg.value == loan.amount, "Send exact loan amount");

        loan.lender = payable(msg.sender);
        loan.isFunded = true;

        loan.borrower.transfer(loan.amount);

        emit LoanFunded(_id, msg.sender);
    }

    function repayLoan(uint _id) external payable onlyBorrower(_id) {
        Loan storage loan = loans[_id];
        require(loan.isFunded, "Loan not funded");
        require(!loan.isRepaid, "Already repaid");
        require(block.timestamp <= loan.deadline, "Deadline passed");
        require(msg.value == loan.repayAmount, "Incorrect repay amount");

        loan.lender.transfer(msg.value);
        loan.isRepaid = true;

        emit LoanRepaid(_id, msg.sender);
    }

    function checkDefault(uint _id) external {
        Loan storage loan = loans[_id];
        require(loan.isFunded, "Loan not funded");
        require(!loan.isRepaid, "Loan already repaid");
        require(block.timestamp > loan.deadline, "Loan still active");

        emit LoanDefaulted(_id, loan.borrower);
    }

    function getLoanDetails(uint _id) external view returns (
        address borrower,
        address lender,
        uint amount,
        uint repayAmount,
        uint deadline,
        bool isFunded,
        bool isRepaid
    ) {
        Loan storage l = loans[_id];
        return (
            l.borrower,
            l.lender,
            l.amount,
            l.repayAmount,
            l.deadline,
            l.isFunded,
            l.isRepaid
        );
    }
}
