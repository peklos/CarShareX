from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from db import models, database
from datetime import datetime, timedelta

router = APIRouter(prefix="/admin/stats", tags=["Админ: Статистика"])

@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(database.get_db)):
    """Получить общую статистику для дашборда"""

    # Общие показатели
    total_users = db.query(models.User).count()
    total_vehicles = db.query(models.Vehicle).count()
    total_bookings = db.query(models.Booking).count()

    # Статусы автомобилей
    available_vehicles = db.query(models.Vehicle).filter(models.Vehicle.status == "available").count()
    in_use_vehicles = db.query(models.Vehicle).filter(models.Vehicle.status == "in_use").count()
    maintenance_vehicles = db.query(models.Vehicle).filter(models.Vehicle.status == "maintenance").count()

    # Статусы бронирований
    active_bookings = db.query(models.Booking).filter(models.Booking.status == "active").count()
    completed_bookings = db.query(models.Booking).filter(models.Booking.status == "completed").count()
    pending_bookings = db.query(models.Booking).filter(models.Booking.status == "pending").count()

    # Общая выручка
    total_revenue = db.query(func.sum(models.Booking.total_cost)).filter(
        models.Booking.status == "completed"
    ).scalar() or 0.0

    # Выручка за текущий месяц
    current_month_start = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_revenue = db.query(func.sum(models.Booking.total_cost)).filter(
        models.Booking.status == "completed",
        models.Booking.end_time >= current_month_start
    ).scalar() or 0.0

    # Самые популярные автомобили (топ-5 по количеству бронирований)
    popular_vehicles = db.query(
        models.Vehicle.id,
        models.Vehicle.brand,
        models.Vehicle.model,
        models.Vehicle.license_plate,
        func.count(models.Booking.id).label("bookings_count")
    ).join(
        models.Booking, models.Vehicle.id == models.Booking.vehicle_id
    ).group_by(
        models.Vehicle.id
    ).order_by(
        func.count(models.Booking.id).desc()
    ).limit(5).all()

    popular_vehicles_list = [
        {
            "id": v.id,
            "brand": v.brand,
            "model": v.model,
            "license_plate": v.license_plate,
            "bookings_count": v.bookings_count
        }
        for v in popular_vehicles
    ]

    # Распределение по типам автомобилей
    vehicle_types = db.query(
        models.Vehicle.vehicle_type,
        func.count(models.Vehicle.id).label("count")
    ).group_by(models.Vehicle.vehicle_type).all()

    vehicle_types_dict = {vt.vehicle_type: vt.count for vt in vehicle_types}

    # Активность пользователей (топ-5 по количеству поездок)
    active_users = db.query(
        models.User.id,
        models.User.first_name,
        models.User.last_name,
        models.User.email,
        func.count(models.Booking.id).label("trips_count"),
        func.sum(models.Booking.total_cost).label("total_spent")
    ).join(
        models.Booking, models.User.id == models.Booking.user_id
    ).group_by(
        models.User.id
    ).order_by(
        func.count(models.Booking.id).desc()
    ).limit(5).all()

    active_users_list = [
        {
            "id": u.id,
            "first_name": u.first_name,
            "last_name": u.last_name,
            "email": u.email,
            "bookings_count": u.trips_count,
            "total_spent": float(u.total_spent or 0)
        }
        for u in active_users
    ]

    # Инциденты
    total_incidents = db.query(models.Incident).count()
    reported_incidents = db.query(models.Incident).filter(models.Incident.status == "reported").count()
    in_progress_incidents = db.query(models.Incident).filter(models.Incident.status == "in_progress").count()
    resolved_incidents = db.query(models.Incident).filter(models.Incident.status == "resolved").count()

    return {
        "overview": {
            "total_users": total_users,
            "total_vehicles": total_vehicles,
            "total_bookings": total_bookings,
            "total_revenue": round(total_revenue, 2),
            "monthly_revenue": round(monthly_revenue, 2)
        },
        "vehicles": {
            "available": available_vehicles,
            "in_use": in_use_vehicles,
            "maintenance": maintenance_vehicles,
            "by_type": vehicle_types_dict
        },
        "bookings": {
            "active": active_bookings,
            "completed": completed_bookings,
            "pending": pending_bookings
        },
        "incidents": {
            "total": total_incidents,
            "reported": reported_incidents,
            "in_progress": in_progress_incidents,
            "resolved": resolved_incidents
        },
        "popular_vehicles": popular_vehicles_list,
        "active_users": active_users_list
    }


@router.get("/revenue")
def get_revenue_stats(db: Session = Depends(database.get_db)):
    """Получить статистику выручки"""

    # Выручка за последние 30 дней (по дням)
    last_30_days = datetime.now() - timedelta(days=30)

    daily_revenue = db.query(
        func.date(models.Booking.end_time).label("date"),
        func.sum(models.Booking.total_cost).label("revenue")
    ).filter(
        models.Booking.status == "completed",
        models.Booking.end_time >= last_30_days
    ).group_by(
        func.date(models.Booking.end_time)
    ).order_by(
        func.date(models.Booking.end_time)
    ).all()

    daily_revenue_list = [
        {
            "date": str(dr.date),
            "revenue": float(dr.revenue or 0)
        }
        for dr in daily_revenue
    ]

    # Выручка по тарифам
    revenue_by_tariff = db.query(
        models.Tariff.name,
        func.sum(models.Booking.total_cost).label("revenue"),
        func.count(models.Booking.id).label("bookings_count")
    ).join(
        models.Booking, models.Tariff.id == models.Booking.tariff_id
    ).filter(
        models.Booking.status == "completed"
    ).group_by(
        models.Tariff.name
    ).all()

    tariff_revenue_list = [
        {
            "tariff": rt.name,
            "revenue": float(rt.revenue or 0),
            "bookings": rt.bookings_count
        }
        for rt in revenue_by_tariff
    ]

    return {
        "daily_revenue_last_30_days": daily_revenue_list,
        "revenue_by_tariff": tariff_revenue_list
    }
