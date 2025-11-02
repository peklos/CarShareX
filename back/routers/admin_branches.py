from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import branch as branch_schemas
from typing import List

router = APIRouter(prefix="/admin/branches", tags=["Админ: Офисы"])

@router.get("/", response_model=List[branch_schemas.BranchResponse])
def get_all_branches(db: Session = Depends(database.get_db)):
    """Получить все офисы"""
    branches = db.query(models.Branch).all()
    return branches

@router.post("/", response_model=branch_schemas.BranchResponse)
def create_branch(branch_data: branch_schemas.BranchCreate, db: Session = Depends(database.get_db)):
    """Создать новый офис"""
    new_branch = models.Branch(
        name=branch_data.name,
        address=branch_data.address,
        phone=branch_data.phone
    )

    db.add(new_branch)
    db.commit()
    db.refresh(new_branch)

    return new_branch

@router.patch("/{branch_id}", response_model=branch_schemas.BranchResponse)
def update_branch(branch_id: int, branch_data: branch_schemas.BranchUpdate, db: Session = Depends(database.get_db)):
    """Обновить офис"""
    branch = db.query(models.Branch).filter(models.Branch.id == branch_id).first()

    if not branch:
        raise HTTPException(status_code=404, detail="Офис не найден")

    if branch_data.name:
        branch.name = branch_data.name
    if branch_data.address:
        branch.address = branch_data.address
    if branch_data.phone:
        branch.phone = branch_data.phone

    db.commit()
    db.refresh(branch)

    return branch

@router.delete("/{branch_id}")
def delete_branch(branch_id: int, db: Session = Depends(database.get_db)):
    """Удалить офис"""
    branch = db.query(models.Branch).filter(models.Branch.id == branch_id).first()

    if not branch:
        raise HTTPException(status_code=404, detail="Офис не найден")

    db.delete(branch)
    db.commit()

    return {"message": "Офис удален", "branch_id": branch_id}
