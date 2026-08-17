from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def api_root():
    return {"status": "api working"}

module_api = router