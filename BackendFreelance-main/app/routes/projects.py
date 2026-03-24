from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.project import ProjectModel

projects_bp = Blueprint('projects', __name__)


# ── GET /api/projects ─────────────────────────────────────────────────────────
@projects_bp.route('/api/projects', methods=['GET'])
def get_projects():
    page     = request.args.get('page',     1,    type=int)
    limit    = request.args.get('limit',    10,   type=int)
    status   = request.args.get('status',   None)
    category = request.args.get('category', None)
    skill    = request.args.get('skill',    None)

    if status and status not in ProjectModel.VALID_STATUSES:
        return jsonify({'message': f'Invalid status. Must be one of: {", ".join(ProjectModel.VALID_STATUSES)}'}), 422

    result = ProjectModel.find_all(page=page, limit=limit, status=status, category=category, skill=skill)
    return jsonify(result), 200


# ── GET /api/projects/search ──────────────────────────────────────────────────
@projects_bp.route('/api/projects/search', methods=['GET'])
def search_projects():
    q     = request.args.get('q', '')
    page  = request.args.get('page',  1,  type=int)
    limit = request.args.get('limit', 10, type=int)

    result = ProjectModel.search(q=q, page=page, limit=limit)
    return jsonify(result), 200


# ── GET /api/projects/client/<client_id> ──────────────────────────────────────
@projects_bp.route('/api/projects/client/<string:client_id>', methods=['GET'])
@jwt_required()
def get_client_projects(client_id):
    result = ProjectModel.find_by_client(client_id)
    return jsonify(result), 200


# ── GET /api/projects/<id> ────────────────────────────────────────────────────
@projects_bp.route('/api/projects/<string:project_id>', methods=['GET'])
def get_project(project_id):
    project = ProjectModel.find_by_id(project_id)
    if not project:
        return jsonify({'message': 'Project not found'}), 404
    return jsonify(ProjectModel.serialize(project)), 200


# ── POST /api/projects ────────────────────────────────────────────────────────
@projects_bp.route('/api/projects', methods=['POST'])
@jwt_required()
def create_project():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'message': 'No JSON body provided'}), 400

    required = ['title', 'client', 'budget']
    missing  = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({'message': f'Missing fields: {", ".join(missing)}'}), 422

    client_id  = get_jwt_identity()
    project_id = ProjectModel.create(data, client_id)
    project    = ProjectModel.find_by_id(project_id)

    return jsonify({
        'message': 'Project created successfully',
        'project': ProjectModel.serialize(project),
    }), 201


# ── PUT /api/projects/<id> ────────────────────────────────────────────────────
@projects_bp.route('/api/projects/<string:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    project = ProjectModel.find_by_id(project_id)
    if not project:
        return jsonify({'message': 'Project not found'}), 404

    data = request.get_json(silent=True) or {}
    ProjectModel.update(project_id, data)
    return jsonify({'message': 'Project updated successfully'}), 200


# ── PATCH /api/projects/<id>/status ───────────────────────────────────────────
@projects_bp.route('/api/projects/<string:project_id>/status', methods=['PATCH'])
@jwt_required()
def update_project_status(project_id):
    project = ProjectModel.find_by_id(project_id)
    if not project:
        return jsonify({'message': 'Project not found'}), 404

    data   = request.get_json(silent=True) or {}
    status = data.get('status')

    if not status or status not in ProjectModel.VALID_STATUSES:
        return jsonify({'message': f'Invalid status. Must be one of: {", ".join(ProjectModel.VALID_STATUSES)}'}), 422

    ProjectModel.update_status(project_id, status)
    return jsonify({'message': 'Project status updated successfully'}), 200


# ── DELETE /api/projects/<id> ─────────────────────────────────────────────────
@projects_bp.route('/api/projects/<string:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    project = ProjectModel.find_by_id(project_id)
    if not project:
        return jsonify({'message': 'Project not found'}), 404

    ProjectModel.delete(project_id)
    return jsonify({'message': 'Project deleted successfully'}), 200