from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import employee as employee_schemas
from typing import List

router = APIRouter(prefix="/admin/employees", tags=["Админ: Сотрудники"])

@router.get("/", response_model=List[employee_schemas.EmployeeResponse])
def get_all_employees(employee_id: int, db: Session = Depends(database.get_db)):
    """Получить всех сотрудников (только SuperAdmin)"""
    # Проверка прав
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not employee or employee.role_id != 1:  # role_id=1 это SuperAdmin
        raise HTTPException(status_code=403, detail="Доступ запрещен. Требуется роль SuperAdmin")

    employees = db.query(models.Employee).all()
    return employees

@router.post("/", response_model=employee_schemas.EmployeeResponse)
def create_employee(employee_data: employee_schemas.EmployeeCreate, admin_id: int, db: Session = Depends(database.get_db)):
    """Создать нового сотрудника (только SuperAdmin)"""
    # Проверка прав
    admin = db.query(models.Employee).filter(models.Employee.id == admin_id).first()
    if not admin or admin.role_id != 1:
        raise HTTPException(status_code=403, detail="Доступ запрещен. Требуется роль SuperAdmin")

    # Проверка email
    existing = db.query(models.Employee).filter(models.Employee.email == employee_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email уже используется")

    new_employee = models.Employee(
        first_name=employee_data.first_name,
        last_name=employee_data.last_name,
        email=employee_data.email,
        password=employee_data.password,
        role_id=employee_data.role_id,
        branch_id=employee_data.branch_id
    )

    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)

    return new_employee

@router.patch("/{emp_id}", response_model=employee_schemas.EmployeeResponse)
def update_employee(emp_id: int, employee_data: employee_schemas.EmployeeUpdate, admin_id: int, db: Session = Depends(database.get_db)):
    """Обновить сотрудника (только SuperAdmin)"""
    # Проверка прав
    admin = db.query(models.Employee).filter(models.Employee.id == admin_id).first()
    if not admin or admin.role_id != 1:
        raise HTTPException(status_code=403, detail="Доступ запрещен")

    employee = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")

    if employee_data.first_name:
        employee.first_name = employee_data.first_name
    if employee_data.last_name:
        employee.last_name = employee_data.last_name
    if employee_data.email:
        employee.email = employee_data.email
    if employee_data.role_id:
        employee.role_id = employee_data.role_id
    if employee_data.branch_id is not None:
        employee.branch_id = employee_data.branch_id

    db.commit()
    db.refresh(employee)

    return employee

@router.delete("/{emp_id}")
def delete_employee(emp_id: int, admin_id: int, db: Session = Depends(database.get_db)):
    """Удалить сотрудника (только SuperAdmin)"""
    # Проверка прав
    admin = db.query(models.Employee).filter(models.Employee.id == admin_id).first()
    if not admin or admin.role_id != 1:
        raise HTTPException(status_code=403, detail="Доступ запрещен")

    employee = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")

    db.delete(employee)
    db.commit()

    return {"message": "Сотрудник удален", "employee_id": emp_id}
